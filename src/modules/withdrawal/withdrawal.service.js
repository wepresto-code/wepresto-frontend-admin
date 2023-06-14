import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class WithdrawalService {
  async getLenderParticipations({
    lenderUid = undefined,
    startAmount = undefined,
    endAmount = undefined,
    take = undefined,
    skip = undefined
  }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}withdrawals/lender-withdrawals`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        lenderUid: lenderUid,
        startAmount: startAmount || undefined,
        endAmount: endAmount || undefined,
        take,
        skip,
      },
    });

    const { count, withdrawals } = data;

    return {
      count,
      withdrawals: withdrawals.map((loan) => ({
        ...loan,
        id: "" + loan.id,
      })),
    };
  }
}

const withdrawalService = new WithdrawalService();

export default withdrawalService;
