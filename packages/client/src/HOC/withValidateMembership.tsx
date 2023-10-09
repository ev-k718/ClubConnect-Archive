import useAuth from '@/hooks/useAuth';
import Error from 'next/error';
import Router from 'next/router';

const withValidateMembership = (
  WrappedComponent: any,
  memberType: 'ownerOnly' | 'membersOnly',
) => {
  return function WithValidateMembership() {
    const { getUserClubMemberships } = useAuth();
    const { data, isLoading, error } = getUserClubMemberships();

    if (isLoading) {
      return <>Loading...</>;
    } else if (error) {
      return <Error statusCode={500} />;
    }

    if (data) {
      // console.log('memberType', memberType);
      const { clubsOwned, clubMemberships } = data.data;
      const { clubId } = Router.query;
      const userIsClubOwner = clubsOwned.find(
        (club: any) => club.id === clubId,
      );
      // console.log('userIsClubOwner', userIsClubOwner);
      const userIsClubMember = clubMemberships.find(
        (clubMember: any) => clubMember.clubId === clubId,
      );
      // console.log('userIsClubMember', userIsClubMember);
      // console.log('memberType', memberType);

      if (
        (memberType === 'ownerOnly' && userIsClubOwner) ||
        (memberType === 'membersOnly' && (userIsClubMember || userIsClubOwner))
      ) {
        if (WrappedComponent.getLayout) {
          return WrappedComponent.getLayout(<WrappedComponent />);
        }
        return <WrappedComponent />;
      } else {
        return <Error statusCode={404} />;
      }
    }
  };
};

export default withValidateMembership;
