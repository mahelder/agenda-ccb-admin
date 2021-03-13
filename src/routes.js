/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import ChurchesList from "views/Churches/ChurchesList.js";
import ChurchesForm from "views/Churches/ChurchesForm.js";
import VolunteersList from "views/Volunteers/VolunteersList.js";
import VolunteersForm from "views/Volunteers/VolunteersForm.js";
import JobsList from "views/Jobs/JobsList.js";
import JobsForm from "views/Jobs/JobsForm.js";
import ContactsList from "views/Contacts/ContactsList.js";
import ContactsForm from "views/Contacts/ContactsForm.js";
import AgendasList from "views/Agendas/AgendasList.js";
import AgendasForm from "views/Agendas/AgendasForm.js";
import UsersList from "views/Users/UsersList.js";
import UsersForm from "views/Users/UsersForm.js";

// core components/views for RTL layout

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/casas-de-oracao",
    name: "Casas de Oração",
    icon: "location_city",
    component: ChurchesList,
    layout: "/admin",
  },
  {
    path: "/nova-casa-de-oracao",
    name: "Nova Casa de Oração",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "location_city",
    component: ChurchesForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/editar-casa-de-oracao/:admin/:id",
    name: "Editar Casa de Oração",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "location_city",
    component: ChurchesForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/lista-telefones",
    name: "Lista de Telefones",
    icon: "list",
    component: ContactsList,
    layout: "/admin",
  },
  {
    path: "/novo-contato",
    name: "Cadastro Contato",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "location_city",
    component: ContactsForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/editar-contato/:admin/:secao/:cargo/:id",
    name: "Editar Contato",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "location_city",
    component: ContactsForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/voluntarios",
    name: "Voluntários",
    icon: Person,
    component: VolunteersList,
    layout: "/admin",
  },
  {
    path: "/novo-voluntario",
    name: "Novo Voluntário",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: VolunteersForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/editar-voluntario/:admin/:id",
    name: "Editar Voluntário",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: VolunteersForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/reunioes",
    name: "Reuniões",
    icon: "calendar_today",
    component: AgendasList,
    layout: "/admin",
  },
  {
    path: "/nova-reuniao",
    name: "Nova Reunião",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "calendar_today",
    component: AgendasForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/editar-reuniao/:type/:month/:id",
    name: "Editar Reuniao",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "calendar_today",
    component: AgendasForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/cargos",
    name: "Cargos",
    icon: "work",
    component: JobsList,
    layout: "/admin",
  },
  {
    path: "/novo-cargo",
    name: "Novo Cargo",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "work",
    component: JobsForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/editar-cargo/:admin/:secao/:id",
    name: "Editar Cargo",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "work",
    component: JobsForm,
    invisible: true,
    layout: "/admin",
  },
  {
    path: "/usuarios",
    name: "Usuários",
    icon: Person,
    component: UsersList,
    layout: "/admin",
  },
  {
    path: "/novo-usuario",
    name: "Novo Usuário",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: UsersForm,
    invisible: true,
    layout: "/admin",
  },
];

export default dashboardRoutes;
