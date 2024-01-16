export const GraphDataBuilder = (data, items) => {
  const quarterCount = data[items[0]].length;
  const graphData = [];
  for (let i = 0; i < quarterCount; i++) {
    const dataPoint = {};
    dataPoint["name"] = `Q-${
      i <= 10 ? quarterCount - i : "0" + (quarterCount - i)
    }`;
    items.forEach((item) => {
      dataPoint[item] = data[item][i];
    });
    graphData.push(dataPoint);
  }
  return graphData;
};

export const ChooseCurrencyFormatter = (sample, dollarOn) => {
  let formatter = formatThousands;
  if (sample >= 1000000000) formatter = formatBillions;
  else if (sample >= 1000000) formatter = formatMillions;

  if (dollarOn) {
    return formatter;
  }
  const newFormatter = (value) => {
    return formatter(value).substring(1);
  };
  return newFormatter;
};

const formatBillions = (value) => {
  const formattedValue = (value / 1e9).toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  });
  return `$${formattedValue}B`;
};

const formatMillions = (value) => {
  const formattedValue = (value / 1e6).toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  });
  return `$${formattedValue}M`;
};

const formatThousands = (value) => {
  return `$${value.toLocaleString("en-US")}`;
};

export const CustomToolTip = ({ active, payload, dollarOn }) => {
  if (active && payload && payload.length) {
    const label = payload[0].payload.name;

    const tooltipItems = payload.map((entry) => {
      const { name, value } = entry;
      let formatter = formatThousands;

      if (value >= 1e9) {
        formatter = formatBillions;
      } else if (value >= 1e6) {
        formatter = formatMillions;
      }

      return (
        <p key={name} style={{ color: entry.color }}>
          {`${name}: ${
            dollarOn ? formatter(value) : formatter(value).substring(1)
          }`}
        </p>
      );
    });
    tooltipItems.push(
      <hr key={"horizontal-rule-insert"} className="mt-2 mb-2"></hr>
    );
    tooltipItems.push(
      <p
        key={"Q-Description-Part-1"}
        style={{ color: "#fff", fontSize: "12px", fontStyle: "italic" }}
      >
        {"***Note: Q-01 is the most recent quarter,"}
      </p>
    );
    tooltipItems.push(
      <p
        key={"Q-Description-Part-2"}
        style={{ color: "#fff", fontSize: "12px", fontStyle: "italic" }}
      >
        {"Q-20 represents the 20th previous quarter."}
      </p>
    );

    return (
      <div
        className="custom-tooltip"
        style={{
          background: "#333",
          border: "1px solid #fff",
          padding: "10px",
        }}
      >
        <p className="label" style={{ color: "#fff" }}>
          {label}
        </p>
        {tooltipItems}
      </div>
    );
  }

  return null;
};
