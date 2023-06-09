import TweetListItem from '../TweetListItem';
import { useGetUsersByPageQuery } from '../../services/api/mockapi';
import { Box } from '@mui/material';
import { useUsers } from '../../Hooks/useUsers';

export const TweetsList = () => {
  const { filteredUsers = [], page } = useUsers();
  const { isLoading } = useGetUsersByPageQuery(page);

  return (
    <Box component={'section'}>
      {!isLoading && (
        <Box
          component={'ul'}
          sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}
        >
          {filteredUsers?.map(user => (
            <li key={user.id}>
              <TweetListItem
                user={user.user}
                avatar={user.avatar}
                id={user.id}
                tweets={user.tweets}
                followers={user.followers}
              />
            </li>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TweetsList;
