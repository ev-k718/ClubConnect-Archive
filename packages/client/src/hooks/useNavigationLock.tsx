import router from "next/router";
import { useEffect } from "react";

/**
 * This is a hook that will prevent the user from navigating away from the page if there are unsaved changes.
 * 
 * Note: If using this on a page with useQuery, you must add the following to all queries:
 * 
 * **refetchOnWindowFocus: false** 
 * 
 * to prevent the query from refetching when the warning is dismissed.
 * @param unsavedChanges a state variable that indicates whether there are unsaved changes
 * @returns nothing
 */
const useNavigationLock = (unsavedChanges: boolean) => {
  return useEffect(() => {
    const warningText =
      'You have unsaved changes - are you sure you wish to leave this page?';
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!unsavedChanges) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      if (!unsavedChanges) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [unsavedChanges]);
};

export default useNavigationLock;
