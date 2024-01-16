import os
from dotenv import load_dotenv

import motor.motor_asyncio

from Levenshtein import distance

from model import Stock
from model import Ticker
from model import AvailableTicker

# Load environment variables from the .env file
load_dotenv()
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_DB_ADDRESS"))
database = client.StockData
collection = database.companies
collection_tickers = database.tickers

def levenshtein_similarity_score(document, input_str):
    ticker_value = document.get("ticker", "")
    longest_length = max(len(input_str), len(ticker_value))
    similarity_score = 100 - (distance(input_str, ticker_value) * 100 / longest_length)
    return similarity_score

async def levenshtein_fuzzy_match(input_str, match_threshold, cache):
    input_str = input_str.upper()

    sorted_search_results = await cache.get("fuzzysearchdata_"+input_str)
    if (sorted_search_results):
        print('Hit Cache for $search_results$ ! Input String: %s, Results: %d'%(input_str, len(sorted_search_results)))
        return sorted_search_results

    search_results = []
    all_tickers = await cache.get("fuzzysearchdata_alltickers")
    if all_tickers is None:
        cursor = collection_tickers.find({})
        cache_all_tickers = []
        async for document in cursor:
            cache_all_tickers.append(document)
            similarity_score = levenshtein_similarity_score(document, input_str)
            if similarity_score >= match_threshold:
                search_results.append(AvailableTicker(**document, fuzzyscore=similarity_score))
        print('SET Cache for *all_tickers* ! Size of cache_all_tickers: %d'%(len(cache_all_tickers)))
        await cache.set("fuzzysearchdata_alltickers", cache_all_tickers)

        sorted_results = sorted(search_results, key=lambda x: x.fuzzyscore, reverse=True)
        print('SET Cache (1) for input_str: %s'%(input_str))
        await cache.set("fuzzysearchdata_"+input_str, sorted_results)
        return sorted_results
    
    print('Hit Cache for *all_tickers* ! Size of all_tickers from cache: %d'%(len(all_tickers)))
    for document in all_tickers:
        similarity_score = levenshtein_similarity_score(document, input_str)
        if similarity_score >= match_threshold:
            search_results.append(AvailableTicker(**document, fuzzyscore=similarity_score))
    sorted_results = sorted(search_results, key=lambda x: x.fuzzyscore, reverse=True)
    print('SET Cache (2) for input_str: %s'%(input_str))
    await cache.set("fuzzysearchdata_"+input_str, sorted_results)
    return sorted_results

async def fetch_alltickers():
    alltickers = []
    cursor = collection_tickers.find({})
    async for document in cursor:
        alltickers.append(AvailableTicker(**document))
    return alltickers

async def fetch_tickers():
    tickers = []
    cursor = collection.find({}, {"ticker": 1, "id": 1, "_id": 0})
    async for document in cursor:
        tickers.append(Ticker(**document))
    return tickers

async def fetch_one_company(ticker):
    document = await collection.find_one({"ticker": ticker})
    return document

async def fetch_all_companies():
    companies = []
    cursor = collection.find({})
    async for document in cursor:
        companies.append(Stock(**document))
    return companies

async def create_ticker_list(tickers, country_str, exchange_str):
    added_tickers = 0
    country_str = country_str.upper()
    exchange_str = exchange_str.upper()
    for ticker in tickers:
        ticker = ticker.upper()
        if ":" not in ticker or not ticker.endswith(country_str):
            continue
        str_split_arr = ticker.split(":")
        item = { 'id': None, 
                'ticker': str_split_arr[0], 
                'country': str_split_arr[1], 
                'exchange': exchange_str}
        result = await collection_tickers.insert_one(item)
        string_id = str(result.inserted_id)
        await collection_tickers.update_one({'ticker': item['ticker'], 
                                             'country': item['country'], 
                                             'exchange': item['exchange']}, 
                                            {'$set': {'id':string_id}})
        added_tickers += 1
    return added_tickers

async def create_company(company):
    document = company
    result = await collection.insert_one(document)
    print(result.inserted_id)
    string_id = str(result.inserted_id)
    add_si_result = await collection.update_one({'ticker': document['ticker']}, 
                                                {'$set': {'id':string_id}})
    print('ObjectID to String Update: matched %d, modified %d' 
          %(add_si_result.matched_count, add_si_result.modified_count))
    return document

async def remove_company(ticker):
    await collection.delete_one({"ticker": ticker})
    return True