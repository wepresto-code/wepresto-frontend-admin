import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser, addMinutes } from "../../utils";

class MovementService {
  async getLoanMovements({
    loanUid = undefined,
    types = undefined,
    startDate = undefined,
    endDate = undefined,
    startAmount = undefined,
    endAmount = undefined,
    take = undefined,
    skip = undefined 
  }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}movements/loan-movements`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        loanUid,
        types,
        startDate,
        endDate,
        startAmount: startAmount || undefined,
        endAmount: endAmount || undefined,
        take,
        skip,
      },
    });

    const { count, movements } = data;

    return {
      count,
      movements: movements.map((loan) => ({
        ...loan,
        id: "" + loan.id,
      })),
    };
  }

  async getLoanPayments({ uid, limit = undefined }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}movements/loan/${uid}/payments`,
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
        id: item.id + "",
        at: addMinutes(item.at, 5 * 60),
      };
    });
  }

  async createPayment({ loanUid, amount, paymentDate }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}movements/payment`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        loanUid,
        amount,
        paymentDate,
      },
    });

    return {
      ...data,
      message: "Pago creado correctamente",
    };
  }
}

const movementService = new MovementService();

export default movementService;
