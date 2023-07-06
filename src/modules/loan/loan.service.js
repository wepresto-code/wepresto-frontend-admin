import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class LoanService {
  async getBorrowerLoans({ borrowerUid = undefined, q = undefined, take = undefined, skip = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}borrowers/loans`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uid: borrowerUid,
        q,
        take,
        skip,
      },
    });

    const { count, loans } = data;

    return {
      count,
      loans: loans.map((loan) => ({
        ...loan,
        id: "" + loan.id,
      })),
    };
  }

  async getOne({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/${uid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
    };
  }

  async getMinimumPaymentAmount({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/minimum-payment-amount`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uid,
      },
    });

    return {
      ...data,
    };
  }

  async getTotalPaymentAmount({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/total-payment-amount`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uid,
      },
    });

    return {
      ...data,
    };
  }

  async review({ uid = undefined, comment = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/loan-review`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uid,
        comment,
      },
    });

    return {
      ...data,
      message: "so far so good"
    };

  }

  async reject({ uid = undefined, comment = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/loan-reject`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uid,
        comment,
      },
    });

    return {
      ...data,
      message: "so far so good"
    };

  }

  async approve({ uid = undefined, comment = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/loan-approve`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uid,
        comment,
      },
    });

    return {
      ...data,
      message: "so far so good"
    };

  }

  async fund({ uid = undefined, comment = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/loan-fund`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uid,
        comment,
      },
    });

    return {
      ...data,
      message: "so far so good"
    };

  }

  async disburse({ uid = undefined, comment = undefined, disbursementDate = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/loan-disburse`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        uid,
        comment,
        disbursementDate,
      },
    });

    return {
      ...data,
      message: "so far so good",
    };
  }

  async getLoansNeedingFunding({ take, skip }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loans/needing-funding`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        take,
        skip,
      },
    });

    const { count, loans } = data;

    return {
      count,
      loans: loans.map((loan) => ({
        ...loan,
        id: "" + loan.id,
      })),
    };

  }

  async createEpaycoTransaction({ uid, amount }) {
    const token = await getIdTokenFromCurrentUser();

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
}

const loanService = new LoanService();

export default loanService;
