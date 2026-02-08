const rolesBody = document.getElementById("roles-body");
const totalHoursEl = document.getElementById("total-hours");
const totalCostEl = document.getElementById("total-cost");
const resetButton = document.getElementById("reset-defaults");

let defaultRoles = [];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(value);

const buildRow = (role, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${role.role}</td>
    <td>
      <select data-index="${index}" data-field="location">
        <option value="onshore">Onshore</option>
        <option value="offshore">Offshore</option>
      </select>
    </td>
    <td>
      <input type="number" min="0" step="1" value="${role.onshoreRate}" data-index="${index}" data-field="onshoreRate" />
    </td>
    <td>
      <input type="number" min="0" step="1" value="${role.offshoreRate}" data-index="${index}" data-field="offshoreRate" />
    </td>
    <td>
      <input type="number" min="0" step="1" value="0" data-index="${index}" data-field="hours" />
    </td>
    <td class="line-total" data-index="${index}" data-field="lineTotal">$0</td>
  `;
  return row;
};

const renderRoles = (roles) => {
  rolesBody.innerHTML = "";
  roles.forEach((role, index) => {
    const row = buildRow(role, index);
    rolesBody.appendChild(row);
  });
};

const getCurrentRows = () => {
  const rows = [];
  rolesBody.querySelectorAll("tr").forEach((row, index) => {
    const onshoreRate = Number(row.querySelector('[data-field="onshoreRate"]').value);
    const offshoreRate = Number(row.querySelector('[data-field="offshoreRate"]').value);
    const hours = Number(row.querySelector('[data-field="hours"]').value);
    const location = row.querySelector('[data-field="location"]').value;
    const activeRate = location === "onshore" ? onshoreRate : offshoreRate;
    rows.push({ index, onshoreRate, offshoreRate, hours, location, activeRate });
  });
  return rows;
};

const updateTotals = () => {
  const rows = getCurrentRows();
  let totalHours = 0;
  let totalCost = 0;

  rows.forEach((row) => {
    const lineTotal = row.hours * row.activeRate;
    totalHours += row.hours;
    totalCost += lineTotal;
    const lineTotalEl = rolesBody.querySelector(
      `[data-index="${row.index}"][data-field="lineTotal"]`
    );
    if (lineTotalEl) {
      lineTotalEl.textContent = formatCurrency(lineTotal);
    }
  });

  totalHoursEl.textContent = totalHours.toLocaleString();
  totalCostEl.textContent = formatCurrency(totalCost);
};

const handleInput = (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) {
    return;
  }
  updateTotals();
};

const resetDefaults = () => {
  renderRoles(defaultRoles);
  updateTotals();
};

const init = async () => {
  try {
    const response = await fetch("db/seeds.json");
    if (!response.ok) {
      throw new Error("Unable to load seed data");
    }
    const data = await response.json();
    defaultRoles = data.roles;
    renderRoles(defaultRoles);
    updateTotals();
  } catch (error) {
    rolesBody.innerHTML = `
      <tr>
        <td colspan="6">Unable to load role defaults. Please verify the seed data.</td>
      </tr>
    `;
  }
};

rolesBody.addEventListener("input", handleInput);
rolesBody.addEventListener("change", handleInput);
resetButton.addEventListener("click", resetDefaults);

init();
