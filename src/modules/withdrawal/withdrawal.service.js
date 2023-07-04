import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class WithdrawalService {
  async getLenderWithdrawals({
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

  async getOne({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}withdrawals/${uid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  }

  async complete ({ uid, file }) {
    const token = await getIdTokenFromCurrentUser();

    const formData = new FormData();
    formData.append("uid", uid);
    if (file) formData.append("file", file);

    const { data } = await axios({
      url: `${environment.API_URL}withdrawals/withdrawal-complete`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: formData,
    });

    return {
      ...data,
      message: "Withdrawal completed successfully",
    };
  }
}

const withdrawalService = new WithdrawalService();

export default withdrawalService;
