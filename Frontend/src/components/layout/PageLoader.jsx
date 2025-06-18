import { LoaderPinwheel } from 'lucide-react'
import useThemeStore from '../../store/useThemeStore';

const PageLoader = () => {
  const {theme} = useThemeStore();
  return (
    <div className='min-h-screen min-w-screen flex items-center justify-center gap-3 bg-base' data-theme={theme}>
        {/* <LoaderPinwheel className='animate h-10 w-10' /> */}
        <span className='inline loading loading-bars'></span>
        <span className='text-xl font-medium italic'>Syncing vibes...</span>
    </div>
  )
}

export default PageLoader