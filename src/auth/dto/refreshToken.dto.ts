import { Schema } from "mongoose";

export type RefreshTokenDTO = {
  _id: string;
  refreshToken: string;
}