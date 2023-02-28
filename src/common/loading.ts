import { useLoading } from 'vue-loading-overlay';

export const $loading = useLoading({
  isFullPage: true,
  loader: 'dots',
  color: '#3B82F6',
  backgroundColor: '#F9FAFB',
  opacity: 0.5,
  width: 64,
  height: 64,
  zIndex: 999,
});
