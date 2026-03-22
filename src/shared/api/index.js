export { api } from './instance';

// auth - user
export { loginUser, signupUser, withdrawUser } from './auth';
export { changeUserPassword, checkUserEmailDuplicate } from './auth';

// auth - rider
export { loginRider, signupRider, withdrawRider } from './auth';
export { changeRiderPassword, checkRiderEmailDuplicate } from './auth';

// user profile & address
export {
  updateUserNickname,
  updateUserPhoneNumber,
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  updateAddressAlias,
} from './user';

// rider profile & status
export {
  updateRiderNickname,
  updateRiderPhoneNumber,
  updateRiderVehicle,
  setRiderOnline,
  setRiderOffline,
  startRiderDelivery,
  completeRiderDelivery,
} from './rider';

// order
export { createOrder, assignRiderToOrder } from './order';

// delivery
export {
  assignRiderToDelivery,
  startDelivery,
  completeDelivery,
  getDeliveryLocation,
  updateDeliveryLocation,
} from './delivery';

// payment
export {
  createPayment,
  approvePayment,
  failPayment,
  cancelPayment,
  getPaymentDetail,
  getMyPayments,
} from './payment';

// review
export {
  createStoreReview,
  deleteMyReview,
  getMyReviews,
  getReviewDetail,
} from './review';

// store
export {
  createStore,
  searchStores,
  getStoreDetail,
  getStoreMenus,
  getStoreReviews,
  getSearchHistory,
} from './store';

// search
export {
  getAutocompleteSuggestions,
  getPopularKeywords,
  getRecentKeywords,
  deleteRecentKeyword,
  deleteAllRecentKeywords,
} from './search';
