import axios from "axios";

import environment from "../../environment";

import { getIdTokenFromCurrentUser } from "../../utils";

class BorrowerService {
  async getOne({ uid }) {
    const token = await getIdTokenFromCurrentUser();

    const { data } = await axios({
      url: `${environment.API_URL}borrowers/${uid}`,
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

const borrowerService = new BorrowerService();

export default borrowerService;
