import { useMemo, useState } from "react";

const initialDesignations = [
  {
    id: "product-manager",
    title: "Product Manager",
    onshoreHourly: 120,
    onshoreMonthly: 19200,
    offshoreHourly: 65,
    offshoreMonthly: 10400
  },
  {
    id: "solution-architect",
    title: "Solution Architect",
    onshoreHourly: 140,
    onshoreMonthly: 22400,
    offshoreHourly: 75,
    offshoreMonthly: 12000
  },
  {
    id: "tech-lead",
    title: "Technical Lead",
    onshoreHourly: 130,
    onshoreMonthly: 20800,
    offshoreHourly: 70,
    offshoreMonthly: 11200
  },
  {
    id: "frontend-engineer",
    title: "Frontend Engineer",
    onshoreHourly: 110,
    onshoreMonthly: 17600,
    offshoreHourly: 60,
    offshoreMonthly: 9600
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    onshoreHourly: 115,
    onshoreMonthly: 18400,
    offshoreHourly: 62,
    offshoreMonthly: 9920
  },
  {
    id: "fullstack-engineer",
    title: "Full Stack Engineer",
    onshoreHourly: 118,
    onshoreMonthly: 18880,
    offshoreHourly: 64,
    offshoreMonthly: 10240
  },
  {
    id: "mobile-engineer",
    title: "Mobile Engineer",
    onshoreHourly: 115,
    onshoreMonthly: 18400,
    offshoreHourly: 63,
    offshoreMonthly: 10080
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    onshoreHourly: 125,
    onshoreMonthly: 20000,
    offshoreHourly: 68,
    offshoreMonthly: 10880
  },
  {
    id: "qa-engineer",
    title: "QA Engineer",
    onshoreHourly: 90,
    onshoreMonthly: 14400,
    offshoreHourly: 50,
    offshoreMonthly: 8000
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    onshoreHourly: 120,
    onshoreMonthly: 19200,
    offshoreHourly: 68,
    offshoreMonthly: 10880
  },
  {
    id: "ui-designer",
    title: "UI Designer",
    onshoreHourly: 95,
    onshoreMonthly: 15200,
    offshoreHourly: 52,
    offshoreMonthly: 8320
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    onshoreHourly: 100,
    onshoreMonthly: 16000,
    offshoreHourly: 55,
    offshoreMonthly: 8800
  },
  {
    id: "security-analyst",
    title: "Security Analyst",
    onshoreHourly: 135,
    onshoreMonthly: 21600,
    offshoreHourly: 72,
    offshoreMonthly: 11520
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    onshoreHourly: 105,
    onshoreMonthly: 16800,
    offshoreHourly: 58,
    offshoreMonthly: 9280
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    onshoreHourly: 100,
    onshoreMonthly: 16000,
    offshoreHourly: 55,
    offshoreMonthly: 8800
  }
];

const initialLineItems = [
  { id: 1, designationId: "product-manager", hours: 120, region: "onshore" },
  { id: 2, designationId: "tech-lead", hours: 160, region: "onshore" },
  { id: 3, designationId: "frontend-engineer", hours: 160, region: "offshore" },
  { id: 4, designationId: "backend-engineer", hours: 160, region: "offshore" }
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const hoursFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

export default function QuoteBuilder() {
  const [designations, setDesignations] = useState(initialDesignations);
  const [lineItems, setLineItems] = useState(initialLineItems);

  const designationLookup = useMemo(() => {
    return designations.reduce((accumulator, designation) => {
      accumulator[designation.id] = designation;
      return accumulator;
    }, {});
  }, [designations]);

  const handleRateChange = (id, field, value) => {
    const normalizedValue = Number.isNaN(Number(value)) ? 0 : Number(value);
    setDesignations((prev) =>
      prev.map((designation) =>
        designation.id === id
          ? {
              ...designation,
              [field]: normalizedValue
            }
          : designation
      )
    );
  };

  const handleLineItemChange = (id, field, value) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "hours" ? Number(value) : value
            }
          : item
      )
    );
  };

  const addLineItem = () => {
    const nextId = Math.max(...lineItems.map((item) => item.id), 0) + 1;
    setLineItems((prev) => [
      ...prev,
      {
        id: nextId,
        designationId: designations[0].id,
        hours: 160,
        region: "onshore"
      }
    ]);
  };

  const removeLineItem = (id) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calculateLineValues = (item) => {
    const designation = designationLookup[item.designationId];
    if (!designation) {
      return {
        hourlyRate: 0,
        monthlyRate: 0,
        lineTotal: 0
      };
    }

    const hourlyRate =
      item.region === "onshore" ? designation.onshoreHourly : designation.offshoreHourly;
    const monthlyRate =
      item.region === "onshore" ? designation.onshoreMonthly : designation.offshoreMonthly;
    const lineTotal = hourlyRate * item.hours;

    return { hourlyRate, monthlyRate, lineTotal };
  };

  const teamTotal = lineItems.reduce((total, item) => {
    const { lineTotal } = calculateLineValues(item);
    return total + lineTotal;
  }, 0);

  return (
    <section className="quote-builder">
      <div className="quote-builder__grid">
        <div className="quote-builder__panel">
          <div className="panel__header">
            <h2>Base Rates</h2>
            <p>Edit rate cards to compare delivery models.</p>
          </div>
          <div className="rate-table">
            <div className="rate-table__header">
              <span>Designation</span>
              <span>Onshore (Hourly)</span>
              <span>Onshore (Monthly)</span>
              <span>Offshore (Hourly)</span>
              <span>Offshore (Monthly)</span>
            </div>
            {designations.map((designation) => (
              <div className="rate-table__row" key={designation.id}>
                <span>{designation.title}</span>
                <input
                  type="number"
                  value={designation.onshoreHourly}
                  onChange={(event) =>
                    handleRateChange(designation.id, "onshoreHourly", event.target.value)
                  }
                />
                <input
                  type="number"
                  value={designation.onshoreMonthly}
                  onChange={(event) =>
                    handleRateChange(designation.id, "onshoreMonthly", event.target.value)
                  }
                />
                <input
                  type="number"
                  value={designation.offshoreHourly}
                  onChange={(event) =>
                    handleRateChange(designation.id, "offshoreHourly", event.target.value)
                  }
                />
                <input
                  type="number"
                  value={designation.offshoreMonthly}
                  onChange={(event) =>
                    handleRateChange(designation.id, "offshoreMonthly", event.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="quote-builder__panel quote-builder__panel--wide">
          <div className="panel__header panel__header--spaced">
            <div>
              <h2>Team Composition</h2>
              <p>Build your team line items and compare monthly impacts.</p>
            </div>
            <button className="button button--primary" type="button" onClick={addLineItem}>
              + Add line item
            </button>
          </div>
          <div className="line-items">
            <div className="line-items__header">
              <span>Designation</span>
              <span>Region</span>
              <span>Hours</span>
              <span>Hourly rate</span>
              <span>Monthly rate</span>
              <span>Line total</span>
              <span></span>
            </div>
            {lineItems.map((item) => {
              const { hourlyRate, monthlyRate, lineTotal } = calculateLineValues(item);

              return (
                <div className="line-items__row" key={item.id}>
                  <select
                    value={item.designationId}
                    onChange={(event) =>
                      handleLineItemChange(item.id, "designationId", event.target.value)
                    }
                  >
                    {designations.map((designation) => (
                      <option value={designation.id} key={designation.id}>
                        {designation.title}
                      </option>
                    ))}
                  </select>
                  <div className="segmented">
                    <button
                      type="button"
                      className={item.region === "onshore" ? "active" : ""}
                      onClick={() => handleLineItemChange(item.id, "region", "onshore")}
                    >
                      Onshore
                    </button>
                    <button
                      type="button"
                      className={item.region === "offshore" ? "active" : ""}
                      onClick={() => handleLineItemChange(item.id, "region", "offshore")}
                    >
                      Offshore
                    </button>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={item.hours}
                    onChange={(event) => handleLineItemChange(item.id, "hours", event.target.value)}
                  />
                  <span>{currencyFormatter.format(hourlyRate)}</span>
                  <span>{currencyFormatter.format(monthlyRate)}</span>
                  <span className="line-items__total">{currencyFormatter.format(lineTotal)}</span>
                  <button
                    type="button"
                    className="button button--ghost"
                    onClick={() => removeLineItem(item.id)}
                    aria-label="Remove line item"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
          <div className="summary">
            <div>
              <p className="summary__label">Total team hours</p>
              <p className="summary__value">
                {hoursFormatter.format(
                  lineItems.reduce((total, item) => total + Number(item.hours), 0)
                )}
              </p>
            </div>
            <div>
              <p className="summary__label">Overall team total</p>
              <p className="summary__value summary__value--highlight">
                {currencyFormatter.format(teamTotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
