import React, { useState, useEffect, useCallback } from "react";
import { VerticalGraph } from "./VerticalGraph";
import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState(holdings);
  const [loading, setLoading] = useState(false);

  const fetchHoldings = useCallback(() => {
    setLoading(true);
    return fetch("http://localhost:3002/holdings")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setAllHoldings(data);
      })
      .catch((error) => {
        console.error("Failed to load holdings from backend:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHoldings();

    // Open SSE connection for real-time updates
    let es;
    try {
      es = new EventSource("http://localhost:3002/stream/holdings");
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (Array.isArray(data)) setAllHoldings(data);
        } catch (err) {
          console.error("Failed to parse SSE holdings data:", err);
        }
      };
      es.onerror = (err) => {
        console.error("SSE error:", err);
        // keep existing polling/fallback via Refresh button
      };
    } catch (err) {
      console.error("EventSource not available:", err);
    }

    return () => {
      if (es) es.close();
    };
  }, [fetchHoldings]);

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // export const data = {
  //   labels,
  //   datasets: [
  // {
  //   label: 'Dataset 1',
  //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
  // },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };

  return (
    <div className="holdings-fullscreen">
      <h3 className="title">
        Holdings ({allHoldings.length})
        <button
          style={{ marginLeft: 12, padding: "6px 10px", fontSize: "0.85rem" }}
          onClick={fetchHoldings}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>

          {allHoldings.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td className={profClass}>
                  {(curValue - stock.avg * stock.qty).toFixed(2)}
                </td>
                <td className={profClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </div>
  );
};

export default Holdings;