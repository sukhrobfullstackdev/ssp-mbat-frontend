import React, {lazy, Suspense} from 'react'
import {Route, Routes} from "react-router-dom"
import Index from "../pages";
import Home from "../dist/Home";
import {LayoutBM} from "../dist/Layout";
import EmployeeTab from "../pages/Employee/EmployeeTab";
import EmployeeAdd from "../pages/Employee/EmployeeAdd";
import RoleTab from "../pages/Role/RoleTab";
import RoleAdd from "../pages/Role/RoleAdd";
import AccessMenu from "../pages/Role/AccessMenu";
import App from "../App";
import SmetaTab from "../pages/Smeta/SmetaTab/SmetaTab";
import SmetaAdd from "../pages/Smeta/SmetaAdd";
import SmetaAcc from "../pages/Smeta/SmetaAcc";
import {FilterProvider} from "../context/FilterContext";

import TEST from "../pages/Smeta/TEST";
import HomeNew from "../dist/Home1";
import NotFound from "./NotFound";


const AccessRole = lazy(() => import('../pages/Employee/AccessRole'))
const AccessDocAction = lazy(() => import('../pages/Role/AccessDocAction'))
const BankInfoTab = lazy(() => import('../pages/Bank/BankInfoTab'))
const BankAccSaldoTab = lazy(() => import('../pages/Bank/BankAccSaldoTab'))
const PaydocAdd = lazy(() => import('../pages/Paydoc/PaydocAdd'))
const PaydocEdit = lazy(() => import('../pages/Paydoc/PaydocEdit'))
const PaydocBankEdit = lazy(() => import('../pages/Paydoc/PaydocBankEdit'))
const PaydocTab = lazy(() => import('../pages/Paydoc/PaydocTab'))
const PaydocOldTab = lazy(() => import('../pages/Paydoc/PaydocOldTab'))
const SmetaAccView = lazy(() => import('../pages/Smeta/SmetaAccView'))
const SmetaAccNew = lazy(() => import('../pages/Smeta/SmetaAccNew'))
const SmetaCreate = lazy(() => import('../pages/Smeta/SmetaCreate'))
const ContractAdd = lazy(() => import('../pages/Contract/ContractAdd'))
const ContractEdit = lazy(() => import('../pages/Contract/ContractEdit'))
const ContractTab = lazy(() => import('../pages/Contract/ContractTab'))
const CashAppAdd = lazy(() => import('../pages/CashApp/CashAppAdd'))
const CashAppTab = lazy(() => import('../pages/CashApp/CashAppTab'))
const CashAppEdit = lazy(() => import('../pages/CashApp/CashAppEdit'))
const VendorAdd = lazy(() => import('../pages/Vendor/VendorAdd'))
const VendorEdit = lazy(() => import('../pages/Vendor/VendorEdit'))
const VendorTab = lazy(() => import('../pages/Vendor/VendorTab'))
const InvoiceAdd = lazy(() => import('../pages/Invoice/InvoiceAdd'))
const InvoiceTab = lazy(() => import('../pages/Invoice/InvoiceTab'))
const AccountAdd = lazy(() => import('../pages/Account/AccountAdd'))
const AccountTab = lazy(() => import('../pages/Account/AccountTab'))
const AccountStateTab = lazy(() => import('../pages/AccountState/AccountStateTab'))
const AccSaldoPeriodTab = lazy(() => import('../pages/AccountState/AccSaldoPeriodTab'))
const AccountMonitoringTab = lazy(() => import('../pages/AccountState/AccountMonitoringTab'))
const SmetaExecuteTab = lazy(() => import('../pages/AccountState/SmetaExecuteTab'))
const ReferencesTab = lazy(() => import('../pages/Reference/ReferencesTab'))
const RefExpenseTab = lazy(() => import('../pages/Reference/RefExpenseTab'))
const RefAccountTypeTab = lazy(() => import('../pages/Reference/AccountType/RefAccountTypeTab'))
const RefBankTypeTab = lazy(() => import('../pages/Reference/RefBankType/RefBankTypeTab'))
const RefBankTab = lazy(() => import('../pages/Reference/RefBank/RefBankTab'))
const RefFilialTab = lazy(() => import('../pages/Reference/RefFilial/RefFilialTab'))
const RefPaydocTypeTab = lazy(() => import('../pages/Reference/RefPaydocTypeTab'))
const RefSmetaTypeTab = lazy(() => import('../pages/Reference/RefSmetaTypeTab'))
const RefRegionTab = lazy(() => import('../pages/Reference/RefRegionTab'))
const RefTerritoryTab = lazy(() => import('../pages/Reference/RefTerritoryTab'))
const RefGoodTab = lazy(() => import('../pages/Reference/RefGoodTab'))
const RefGoodAdd = lazy(() => import('../pages/Reference/RefGoodAdd'))

export const useRoutes = (isAuthenticated, setTitleNav) => {
    function RouteComponent({location, refTitle, refType}) {
        //const route = routes[location.pathname];
        console.log(location, 'location')
        console.log(refType, 'refType')

        /*if (!route) {
            return <div>Page not found</div>;
        }*/

        return (
            /*<ReferencesTab dataSource={route.dataSource} columns={route.columns} />*/
            <ReferencesTab refType={refType} refTitle={refTitle} setTitleNav={setTitleNav}/>
        );
    }

    const logErrorToService = (error, info) => {
        console.error("Caught an error:", error, info);
    };


    if (isAuthenticated) {
        return (
            <Suspense fallback={<div>Юкланмокда...</div>}>

                <FilterProvider>

                        <Routes>

                            <Route exact path="/" element={< Index/>}></Route>

                            <Route exact path='/layout' element={< LayoutBM />}>
                                {/*<Route index element={< Home setTitleNav={setTitleNav}/>}></Route>*/}
                                <Route index element={< HomeNew setTitleNav={setTitleNav}/>}></Route>
                                <Route path="employeeTab" exact
                                       element={<EmployeeTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="employeeAdd" exact element={<EmployeeAdd/>}></Route>
                                <Route path="roleTab" exact element={<RoleTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="roleAdd" exact element={<RoleAdd/>}></Route>
                                <Route path="accessMenu" exact element={<AccessMenu/>}></Route>
                                <Route path="bankInfoTab" exact
                                       element={<BankInfoTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="bankAccSaldoTab" exact
                                       element={<BankAccSaldoTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="smetaTab" exact element={<SmetaTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="smetaAdd" exact element={<SmetaAdd/>}></Route>
                                <Route path="smetaAcc" exact element={<SmetaAcc/>}></Route>
                                <Route path="smetaCreate" exact element={<SmetaCreate/>}></Route>
                                <Route path="paydocTab" exact element={<PaydocTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="paydocOldTab" exact
                                       element={<PaydocOldTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="paydocAdd" exact element={<PaydocAdd/>}></Route>
                                <Route path="paydocTab/edit/:id" exact element={<PaydocEdit/>}></Route>
                                <Route path="paydocTab/editBank/:id/:paydocState" exact
                                       element={<PaydocBankEdit/>}></Route>
                                <Route path="paydocOldTab/edit/:id" exact element={<PaydocEdit/>}></Route>

                                <Route path="SmetaAccView" exact
                                       element={<SmetaAccView setTitleNav={setTitleNav}/>}></Route>
                                <Route path="smetaAccNew" exact
                                       element={<SmetaAccNew setTitleNav={setTitleNav}/>}></Route>

                                <Route path="contractTab" exact
                                       element={<ContractTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="contractAdd" exact element={<ContractAdd/>}></Route>
                                <Route path="contractTab/edit/:id" exact element={<ContractEdit/>}></Route>
                                <Route path="cashAppTab" exact
                                       element={<CashAppTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="cashAppAdd" exact
                                       element={<CashAppAdd setTitleNav={setTitleNav}/>}></Route>
                                <Route path="cashAppTab/edit/:id" exact
                                       element={<CashAppEdit setTitleNav={setTitleNav}/>}></Route>
                                <Route path="vendorAdd" exact element={<VendorAdd setTitleNav={setTitleNav}/>}></Route>
                                <Route path="vendorTab" exact element={<VendorTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="vendorTab/edit/:id" exact element={<VendorEdit/>}></Route>
                                <Route path="invoiceAdd" exact
                                       element={<InvoiceAdd setTitleNav={setTitleNav}/>}></Route>
                                <Route path="invoiceTab" exact
                                       element={<InvoiceTab setTitleNav={setTitleNav}/>}></Route>
                                {/*<Route path="contractTab" exact element={()=> <ContractTab setTitleNav={setTitleNav}/>} ></Route>*/}

                                <Route path="AccessRole" exact element={<AccessRole/>}></Route>
                                <Route path="AccessDocAction" exact element={<AccessDocAction/>}></Route>
                                <Route path="accountTab" exact
                                       element={<AccountTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="accountAdd" exact element={<AccountAdd/>}></Route>

                                <Route path="accountStateTab" exact
                                       element={<AccountStateTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="accSaldoPeriodTab" exact
                                       element={<AccSaldoPeriodTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="accountMonitoringTab" exact
                                       element={<AccountMonitoringTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="smetaExecuteTab" exact
                                       element={<SmetaExecuteTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refTabAccount" exact element={<RouteComponent refType="account"
                                                                                           refTitle="Хисоб ракам маълумотномаси"/>}></Route>
                                <Route path="refTabExpense" exact element={<RouteComponent refType="expense"
                                                                                           refTitle="Харажат моддалари маълумотномаси"/>}></Route>
                                <Route path="refAccountTypeTab" exact
                                       element={<RefAccountTypeTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refBankTab" exact
                                       element={<RefBankTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refBankTypeTab" exact
                                       element={<RefBankTypeTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refFilialTab" exact
                                       element={<RefFilialTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refExpenseTab" exact
                                       element={<RefExpenseTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refPaydocTypeTab" exact
                                       element={<RefPaydocTypeTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refSmetaTypeTab" exact
                                       element={<RefSmetaTypeTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refRegionTab" exact
                                       element={<RefRegionTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refTerritoryTab" exact
                                       element={<RefTerritoryTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refGoodTab" exact
                                       element={<RefGoodTab setTitleNav={setTitleNav}/>}></Route>
                                <Route path="refGoodAdd" exact element={<RefGoodAdd/>}></Route>

                                <Route path="TEST" exact element={<TEST/>}></Route>
                            </Route>


                            <Route path="*" element={<NotFound/>}/>

                        </Routes>
                </FilterProvider>

            </Suspense>
        )
    }

    return (
        <Routes>
            <Route exact path='/' element={< Index/>}></Route>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    )
}