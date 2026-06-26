# HopperFlow — String Hopper Business Management System

A full-stack business management system built for a real-world string hopper manufacturing business. Designed with Clean Architecture, JWT-based Role-Based Access Control, and a modern React frontend.

---

## Tech Stack

**Backend**
- .NET 8 Web API
- Clean Architecture (Domain / Application / Infrastructure / API)
- Entity Framework Core + SQL Server
- JWT Authentication
- Repository Pattern + Unit of Work
- Serilog Logging
- Swagger / OpenAPI

**Frontend**
- React 18 + Vite
- Redux Toolkit (one slice per feature)
- Tailwind CSS v3
- Recharts (data visualization)
- React Router DOM
- Axios with interceptors
- React Hot Toast

---

## Modules

### 1. Inventory & Purchase
- Supplier management (CRUD)
- Rice purchase tracking
- Auto stock calculation on purchase
- Low stock alerts

### 2. Production
- **Team 1 — Preparation:** Rice → Dough (Milling + Sieving tracking)
- **Team 2 — String Hoppers:** Dough → String Hoppers
- Auto stock deduction on production
- Special order flagging

### 3. Sales & Billing
- Customer management with outstanding balance tracking
- Sales order creation
- Invoice generation with print support
- Partial payment and credit sales
- Payment history tracking

### 4. Payroll
- Employee management with auto-generated Employee IDs (EMP-001)
- Daily / Weekly / Monthly salary types
- Attendance marking (daily + bulk) with monthly grid view
- Advance management with flexible installment adjustment
- Monthly payroll generation with bonus + advance deduction
- Printable payslips

### 5. Dashboard
- Business overview with key metrics
- Sales trend (Line chart)
- Production overview (Bar chart)
- Rice stock levels (Bar chart)
- Purchase trend (Line chart)
- Recent orders table

---

## Role-Based Access Control (RBAC)

| Role | Access |
|---|---|
| Admin | Full access — edit, delete, all modules |
| Manager | Inventory (read), Sales, Dashboard |
| Cashier | Sales & Invoices only |
| InventoryManager | Inventory CRUD, Dashboard |
| ProductionManager | Production CRUD, Dashboard |
| HR | Payroll, Employees, Attendance, Advances |

---

## Default Users

| Role | Email | Password |
|---|---|---|
| Admin | admin@hopperflow.com | Admin@123 |
| Manager | manager@hopperflow.com | Manager@123 |
| Cashier | cashier@hopperflow.com | Cashier@123 |
| Inventory Manager | invmanager@hopperflow.com | InvMgr@123 |
| Production Manager | prodmanager@hopperflow.com | ProdMgr@123 |
| HR | hr@hopperflow.com | HR@123456 |

---

## Project Structure

```
HopperFlow/
├── backend/
│   └── HopperFlow/
│       ├── HopperFlow.Domain/          # Entities, Enums, BaseEntity
│       ├── HopperFlow.Application/     # DTOs, Interfaces, Repository contracts
│       ├── HopperFlow.Infrastructure/  # EF Core, Repositories, Services
│       └── HopperFlow.API/             # Controllers, Middleware, Program.cs
│
└── frontend/
    └── src/
        ├── app/                        # Redux store
        ├── components/common/          # Shared components (Modal, StatCard, PageHeader)
        ├── features/
        │   ├── auth/                   # Login, authSlice
        │   ├── inventory/              # Suppliers, Purchases, Stock
        │   ├── production/             # Preparation, Production
        │   ├── sales/                  # Customers, Orders, Invoices
        │   ├── payroll/                # Employees, Attendance, Advances, Payroll
        │   └── dashboard/             # Dashboard with Recharts
        ├── hooks/                      # useRole (RBAC hook)
        └── store/                      # themeSlice
```

---

## Unit Testing (Frontend)

### Tech Stack

| Tool | Purpose |
|---|---|
| Jest | Test runner & assertion library |
| @testing-library/react | Component rendering & DOM queries |
| @testing-library/user-event | User interaction simulation |
| @testing-library/jest-dom | Custom DOM matchers (`toBeInTheDocument`, etc.) |
| identity-obj-proxy | CSS module mock |
| babel-jest | JSX/ESM transform for Jest |

### Test Coverage

#### Redux Slices — 81 tests across 6 suites

| Slice | File | What's tested |
|---|---|---|
| `authSlice` | `features/auth/__tests__/authSlice.test.js` | setAuth, logout, localStorage persistence, selectors (selectIsAdmin, selectCanEdit, selectRole) |
| `salesSlice` | `features/sales/__tests__/salesSlice.test.js` | setCustomers, removeCustomer, setOrders, removeOrder, setLoading, setError |
| `inventorySlice` | `features/inventory/__tests__/inventorySlice.test.js` | Supplier CRUD (add, update, remove), setPurchases, addPurchase, setStocks |
| `payrollSlice` | `features/payroll/__tests__/payrollSlice.test.js` | setEmployees, setAttendance, setAdvances, removeAdvance, setPayrolls |
| `productionSlice` | `features/production/__tests__/productionSlice.test.js` | setBatches, addBatch, removeBatch, setPreparations, removePreparation, setDoughStocks |
| `themeSlice` | `store/__tests__/themeSlice.test.js` | toggleTheme, localStorage dark/light persistence |

#### UI Components

| Component | File | What's tested |
|---|---|---|
| `InputField` | `components/common/__tests__/InputField.test.jsx` | Label rendering, placeholder/type/value forwarding, dark mode classes, onChange, disabled state |
| `StatCard` | `components/common/__tests__/StatCard.test.jsx` | Label & value display, suffix rendering, color class, dark mode styles |
| `Modal` | `components/common/__tests__/Modal.test.jsx` | Visibility (show/hide), children rendering, onClose callback, maxWidth prop |
| `PageHeader` | `components/common/__tests__/PageHeader.test.jsx` | Title & subtitle rendering, action slot, dark mode heading class |

#### Routes & Hooks

| File | What's tested |
|---|---|
| `routes/__tests__/ProtectedRoute.test.jsx` | Redirects to `/login` when no token, renders children when token is present |
| `hooks/__tests__/useRole.test.js` | All 6 roles — isAdmin, isManager, isHR, canEdit, canDelete, canView*, canCreate* flags |

### Configuration Files

```
frontend/
├── jest.config.cjs         # testEnvironment, transform, moduleNameMapper, setupFilesAfterEnv
├── babel.config.cjs        # @babel/preset-env + @babel/preset-react (runtime: automatic)
└── __mocks__/
    └── fileMock.cjs        # SVG / PNG stub → 'test-file-stub'
```

### Running Tests

```bash
cd frontend

# Run all tests once
npm test

# Watch mode (re-runs on file change)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Results

```
Test Suites: 6 passed, 6 total
Tests:       81 passed, 81 total
Snapshots:   0 total
Time:        ~1.5s
```

### Test File Structure

```
src/
├── components/common/__tests__/
│   ├── InputField.test.jsx
│   ├── StatCard.test.jsx
│   ├── Modal.test.jsx
│   └── PageHeader.test.jsx
├── features/
│   ├── auth/__tests__/authSlice.test.js
│   ├── sales/__tests__/salesSlice.test.js
│   ├── inventory/__tests__/inventorySlice.test.js
│   ├── payroll/__tests__/payrollSlice.test.js
│   └── production/__tests__/productionSlice.test.js
├── hooks/__tests__/useRole.test.js
├── routes/__tests__/ProtectedRoute.test.jsx
└── store/__tests__/themeSlice.test.js
```

### Writing New Tests

New slice test template:

```js
import myReducer, { someAction } from '../mySlice'

describe('mySlice', () => {
  it('should return initial state', () => {
    expect(myReducer(undefined, { type: 'unknown' })).toEqual({ /* initial */ })
  })

  it('someAction should update state', () => {
    const state = myReducer(undefined, someAction(payload))
    expect(state.field).toBe(expectedValue)
  })
})
```

New component test template:

```jsx
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent prop="value" />)
    expect(screen.getByText('value')).toBeInTheDocument()
  })
})
```

---

## Git Workflow

```
main          ← production releases
develop       ← integration branch
feature/*     ← sprint feature branches
```

Conventional Commits used throughout:

```
feat(module): description
fix(module): description
refactor(ui): description
chore(sprint): description
test(slice): description
```

---

## Sprints

| Sprint | Module | Status |
|---|---|---|
| Sprint 1 | Foundation, Clean Architecture, JWT Auth | ✅ |
| Sprint 2 | Inventory & Purchase Management | ✅ |
| Sprint 3 | Production — 2-team workflow | ✅ |
| Sprint 4 | Sales, Billing & Invoice | ✅ |
| Sprint 5 | Payroll — Attendance, Advance, Payslip | ✅ |
| Sprint 6 | Dashboard, Recharts, DRY Refactoring | ✅ |
| Sprint 7 | RBAC — 6 Roles | ✅ |
| Sprint 8 | Unit Testing — Jest + Testing Library | ✅ |

---

## Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js 18+
- SQL Server

### Backend Setup

```bash
cd backend/HopperFlow

# Update connection string in HopperFlow.API/appsettings.json

dotnet restore
dotnet run --project HopperFlow.API
```

API runs at: `https://localhost:7242`  
Swagger: `https://localhost:7242/swagger`

### Seed Users

```
POST /api/Auth/seed-admin
POST /api/Auth/seed-users
```

### Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## Key Design Decisions

**Why Clean Architecture?**  
Strict separation of concerns — Domain has no external dependencies, Application defines contracts, Infrastructure implements them.

**Why Repository Pattern + Unit of Work?**  
Abstracts data access, enables testability, and ensures atomic transactions across multiple repositories.

**Why Redux Toolkit over Zustand?**  
Predictable state management with DevTools support — better for scaling across multiple feature slices.

**Why Recharts over Power BI?**  
Recharts is React-native, free, and lightweight — appropriate for a business dashboard at this scale.

**Why separate Invoice page from Sales Orders?**  
Reflects real business flow — orders are created first, payments are recorded at the invoice level.

**Why 2-team Production workflow?**  
Mirrors the actual manufacturing process — Team 1 converts rice to dough, Team 2 presses and steams string hoppers.

**Why Jest + Testing Library over Vitest?**  
Jest has mature ecosystem support, excellent jsdom integration, and works cleanly with Babel — no Vite config workarounds needed for unit tests.
