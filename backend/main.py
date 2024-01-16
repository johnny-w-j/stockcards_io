from fastapi import FastAPI, HTTPException, Depends
from fetchqfs import (
    qfs_fetch_all_us_nyse_tickers,
    qfs_fetch_all_us_nasdaq_tickers,
    qfs_fetch_company,
)
from model import Stock
from typing import Any
from asyncsimplecache import AsyncSimpleCache
import asyncio
from datetime import datetime
from database import (
    levenshtein_fuzzy_match,
    fetch_alltickers,
    fetch_tickers,
    fetch_one_company,
    fetch_all_companies,
    create_ticker_list,
    create_company,
    remove_company,
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://stockcards.frontend.app.s3-website-us-east-1.amazonaws.com",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

async_cache = AsyncSimpleCache()
def get_async_cache():
    return async_cache

async def periodic_purge():
    while True:
        current_time = datetime.now()
        formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")
        print("PURGE SLEEP START - system time:", formatted_time)
        # sleep for 2 hours
        await asyncio.sleep(2 * 60 * 60)
        await async_cache.purge_cache()
        print("PURGED CACHE - system time:", formatted_time)

app.add_event_handler("startup", lambda: asyncio.create_task(periodic_purge()))

@app.get("/")
async def read_root():
    return "Stock Metrics Dashboard Backend"

FUZZYMATCH_THRESHOLD = 60
@app.get("/api/fuzzymatch/{input_str}")
async def get_fuzzymatch(input_str: str, cache: AsyncSimpleCache = Depends(get_async_cache)):
    response = await levenshtein_fuzzy_match(input_str, FUZZYMATCH_THRESHOLD, cache)
    return response

@app.get("/api/alltickers")
async def get_alltickers():
    # response size will be about 800KB
    response = await fetch_alltickers()
    if response:
        return response
    
    # if ticker list is empty in DB, then fetch US tickers and populate the DB
    qfs_nyse_response = await qfs_fetch_all_us_nyse_tickers()
    if qfs_nyse_response is None or qfs_nyse_response['response_body'] is None:
        raise HTTPException(400, "Something went wrong")
    
    create_nyse_response = await create_ticker_list(qfs_nyse_response['response_body']['data'], 'US', 'NYSE')
    if not create_nyse_response:
        raise HTTPException(400, "Something went wrong")
    print('NYSE List Populated for %d items'%(create_nyse_response))

    qfs_nasdaq_response = await qfs_fetch_all_us_nasdaq_tickers()
    if qfs_nasdaq_response is None or qfs_nasdaq_response['response_body'] is None:
        raise HTTPException(400, "Something went wrong")
    
    create_nasdaq_response = await create_ticker_list(qfs_nasdaq_response['response_body']['data'], 'US', 'NASDAQ')
    if not create_nasdaq_response:
        raise HTTPException(400, "Something went wrong")
    print('NASDAQ List Populated for %d items'%(create_nasdaq_response))
    
    all_ticker_response = await fetch_alltickers()
    if not all_ticker_response:
        raise HTTPException(400, "Something went wrong")
    return all_ticker_response

@app.get("/api/tickers")
async def get_tickers():
    response = await fetch_tickers()
    return response

@app.get("/api/stock")
async def get_companies():
    response = await fetch_all_companies()
    return response

@app.get("/api/stock/{ticker}", response_model=Stock)
async def get_company_by_ticker(ticker):
    response = await fetch_one_company(ticker)
    if response:
        return response
    raise HTTPException(404, f"There is no company with the title {ticker}")

@app.post("/api/stock/", response_model=Stock)
async def post_company(formData: dict):
    ticker = formData.get('ticker')
    company = await fetch_one_company(ticker)
    if company:
        print(f"{ticker} exists in database")
        return company
    
    qfs_response = await qfs_fetch_company(ticker)
    if qfs_response is None or qfs_response['response_body'] is None:
        raise HTTPException(400, "Something went wrong")

    company = { 'id': None, 'ticker' : ticker, **qfs_response['response_body']['data'] }
    response = await create_company(company)
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

@app.delete("/api/stock/{ticker}")
async def delete_company(ticker):
    response = await remove_company(ticker)
    if response:
        return "Successfully deleted company"
    raise HTTPException(404, f"There is no company with the title {ticker}")