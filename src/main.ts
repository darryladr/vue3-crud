import './assets/main.css';
import 'vue-final-modal/style.css';
import 'vue-loading-overlay/dist/css/index.css';
import 'vue-multiselect/dist/vue-multiselect.css';

import { addIcons, OhVueIcon } from 'oh-vue-icons';
import {
  FaRegularEye,
  FaRegularEyeSlash,
  FaUserCircle,
  MdLogoutRound,
  MdSpacedashboardRound,
  PrArrowLeft,
  PrArrowRight,
  PrPlus,
  PrSpinner,
} from 'oh-vue-icons/icons';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createVfm } from 'vue-final-modal';
import { LoadingPlugin } from 'vue-loading-overlay';
import Multiselect from 'vue-multiselect';

import App from './App.vue';
import router from './router';

addIcons(
  FaRegularEye,
  FaRegularEyeSlash,
  FaUserCircle,
  MdLogoutRound,
  MdSpacedashboardRound,
  PrArrowLeft,
  PrArrowRight,
  PrPlus,
  PrSpinner
);

const vfm = createVfm();
const app = createApp(App);

app.component('VueIcon', OhVueIcon);
app.component('MultiSelect', Multiselect);
app.use(createPinia());
app.use(router);
app.use(LoadingPlugin);
app.use(vfm);
app.mount('#app');
