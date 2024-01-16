# Pydantic allows auto creation of JSON Schemas from models
from typing import Any
from pydantic import BaseModel

class Stock(BaseModel):
    id : str = None
    ticker: str
    
    revenue_growth: Any
    
    revenue: Any
    cogs: Any
    total_opex: Any
    ebitda: Any

    fcf: Any
    capex: Any

    net_debt: Any
    cash_and_equiv: Any

    period_end_price: Any

    market_cap: Any
    enterprise_value: Any

    shares_eop: Any
    shares_eop_change: Any

class Ticker(BaseModel):
    id : str = None
    ticker: str

class AvailableTicker(BaseModel):
    id : str = None
    ticker: str
    country: str
    exchange: str
    fuzzyscore: int = None