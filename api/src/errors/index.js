import AppErrorConstructor from "./AppError";
import AuthenticationErrorConstructor from "./AuthenticationError";
import PermissionErrorConstructor from "./PermissionError";
import ClientErrorConstructor from "./ClientError";
import NotFoundErrorConstructor from "./NotFoundError";

export const AppError = AppErrorConstructor;
export const AuthenticationError = AuthenticationErrorConstructor;
export const PermissionError = PermissionErrorConstructor;
export const ClientError = ClientErrorConstructor;
export const NotFoundError = NotFoundErrorConstructor;
