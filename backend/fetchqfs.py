import os
from dotenv import load_dotenv

import httpx

# Load environment variables from the .env file
load_dotenv()
qfs_headers = {'x-qfs-api-key' : os.getenv("QFS_API_KEY")}

qfs_batch_url = 'https://public-api.quickfs.net/v1/data/batch'
qfs_us_nyse_tickers_url = 'https://public-api.quickfs.net/v1/companies/US/NYSE'
qfs_us_nasdaq_tickers_url = 'https://public-api.quickfs.net/v1/companies/US/NASDAQ'

async def qfs_fetch_all_us_nyse_tickers():
    async with httpx.AsyncClient() as client:
        response = await client.get(qfs_us_nyse_tickers_url, headers=qfs_headers, timeout=1200)
        print(response.status_code, 'GET - qfs_fetch_all_us_nyse_tickers')
        print(response.status_code, response.json(), len(response.json()['data']))
        return {"status_code": response.status_code, "response_body": response.json()}
    
async def qfs_fetch_all_us_nasdaq_tickers():
    async with httpx.AsyncClient() as client:
        response = await client.get(qfs_us_nasdaq_tickers_url, headers=qfs_headers, timeout=1200)
        print(response.status_code, 'GET - qfs_fetch_all_us_nasdaq_tickers')
        print(response.status_code, response.json(), len(response.json()['data']))
        return {"status_code": response.status_code, "response_body": response.json()}

async def qfs_fetch_company(ticker):
    async with httpx.AsyncClient() as client:
        qfs_request_body = {
                "data": {
                "revenue_growth": f"QFS({ticker},revenue_growth,FQ-19:FQ)",
                "revenue": f"QFS({ticker},revenue,FQ-19:FQ)",
                "cogs": f"QFS({ticker},cogs,FQ-19:FQ)",
                "total_opex": f"QFS({ticker},total_opex,FQ-19:FQ)",
                "ebitda": f"QFS({ticker},ebitda,FQ-19:FQ)",
                "fcf": f"QFS({ticker},fcf,FQ-19:FQ)",
                "capex": f"QFS({ticker},capex,FQ-19:FQ)",
                "net_debt": f"QFS({ticker},net_debt,FQ-19:FQ)",
                "cash_and_equiv": f"QFS({ticker},cash_and_equiv,FQ-19:FQ)",
                "period_end_price": f"QFS({ticker},period_end_price,FQ-19:FQ)",
                "market_cap": f"QFS({ticker},market_cap,FQ-19:FQ)",
                "enterprise_value": f"QFS({ticker},enterprise_value,FQ-19:FQ)",
                "shares_eop": f"QFS({ticker},shares_eop,FQ-19:FQ)",
                "shares_eop_change": f"QFS({ticker},shares_eop_change,FQ-19:FQ)"
            }
        }
        # Make an asynchronous POST request
        response = await client.post(qfs_batch_url, json=qfs_request_body, headers=qfs_headers)
        print(response.status_code, response.json())
        return {"status_code": response.status_code, "response_body": response.json()}
