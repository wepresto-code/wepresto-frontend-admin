import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser, addMinutes } from "../../utils";

class LoanService {
  async getOverview() {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/overview`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
    };
  }

  async getUserLoans({ userAuthUid, limit = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/user-loans/${userAuthUid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: limit,
      },
    });

    return data.map((item) => {
      return {
        ...item,
        id: "" + item.id,
      };
    });
  }

  async getLoanDetails({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/details/${uid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
      loanPaymentDate: addMinutes(data.loanPaymentDate, 5 * 60),
    };
  }

  async createEpaycoTransaction({ uid, amount }) {
    const token = await getIdTokenFromCurrentUser();

    // eslint-disable-next-line no-console
    console.log("amount", Math.ceil(amount));

    const { data } = await axios({
      url: `${environment.API_URL}epayco-transactions`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        loanUid: uid,
        amount: Math.ceil(amount),
      },
    });

    return data;
  }

  async getEpaycoTrasaction({ ePaycoRef }) {
    // eslint-disable-next-line no-console
    console.log(
      `https://secure.epayco.co/validation/v1/reference/${ePaycoRef}`
    );

    const { data } = await axios({
      url: `https://secure.epayco.co/validation/v1/reference/${ePaycoRef}`,
      method: "GET",
      headers: {},
    });

    return { ...data.data };
  }

  prepareEPaycoData({
    invoice,
    amount,
    name_billing,
    address_billing,
    mobilephone_billing,
    number_doc_billing,
  }) {
    // define ther data for epayco checkout
    const data = {
      //Parametros compra (obligatorio)
      name: "Pago de servicios profesionales",
      description: "Pago de servicios profesionales",
      invoice,
      currency: "cop",
      amount,
      tax_base: "0",
      tax: "0",
      country: "co",
      lang: "es",

      //Onpage="false" - Standard="true"
      external: "true",

      //Atributos opcionales
      // extra1: "extra1"
      // extra2: "extra2",
      // extra3: "extra3",
      confirmation: environment.API_URL + "epayco-transactions/confirmation",
      // p_confirm_method: "post",
      response: environment.API_URL + "epayco-transactions/response",

      //Atributos cliente
      name_billing,
      address_billing,
      type_doc_billing: "cc",
      mobilephone_billing,
      number_doc_billing,

      //atributo deshabilitación metodo de pago
      // methodsDisable: ["TDC", "PSE", "SP", "CASH", "DP"],
    };

    return data;
  }

  async getBorrowers() {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/admin/borrowers`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data.map((item) => {
      return {
        ...item,
        id: item.id + "",
      };
    });
  }

  async getTotalBorrowedPerMonth() {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/admin/total-borrowed-per-month`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  }

  async getTotalByTypes() {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/admin/total-by-types`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  }

  async createLoan({ userAuthUid, amount, monthlyInterestRate, monthlyInterestOverdueRate, startDate, description }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userAuthUid,
        amount,
        monthlyInterestRate,
        monthlyInterestOverdueRate,
        startDate,
        description,
      },
    });

    return {
      ...data,
      message: "Préstamo creado exitosamente",
    };
  }
}

const loanService = new LoanService();

export default loanService;
