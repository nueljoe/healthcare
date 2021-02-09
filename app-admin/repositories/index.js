import AuthRepo from './Auth'

export default (context) => {
  return {
    auth: AuthRepo(context),
  }
}
