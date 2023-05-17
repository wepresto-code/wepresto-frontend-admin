import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class LenderService {
  async getOne({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}lenders/${uid}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ...data,
    };
  }
}

const lenderService = new LenderService();

export default lenderService;
