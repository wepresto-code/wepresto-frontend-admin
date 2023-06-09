import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class LoanParticipationService {
  async getLenderParticipations({
    lenderUid = undefined,
    startAmount = undefined,
    endAmount = undefined,
    take = undefined,
    skip = undefined
  }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}lenders/participations`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uid: lenderUid,
        startAmount: startAmount || undefined,
        endAmount: endAmount || undefined,
        take,
        skip,
      },
    });

    const { count, participations } = data;

    return {
      count,
      participations: participations.map((loan) => ({
        ...loan,
        id: "" + loan.id,
      })),
    };
  }

  async create({ lenderUid, loanUid, amount }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}loan-participations`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        lenderUid,
        loanUid,
        amount,
      },
    });

    return {
      ...data,
      message: "Loan participation created successfully",
    };
  }
}

const loanParticipationService = new LoanParticipationService();

export default loanParticipationService;
