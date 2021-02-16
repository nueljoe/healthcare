export default ({ $axios }) => ({
  login(payload) {
    return $axios.$post('/auth/signin', payload)
  },
})
