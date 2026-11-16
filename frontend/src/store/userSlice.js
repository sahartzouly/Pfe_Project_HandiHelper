import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    profileId: null,
    nom: null,
    handicapType: null,
    role: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId
      state.profileId = action.payload.profileId
      state.nom = action.payload.nom
      state.handicapType = action.payload.handicapType
      state.role = action.payload.role
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    clearUser: (state) => {
      state.userId = null
      state.profileId = null
      state.nom = null
      state.handicapType = null
      state.role = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer