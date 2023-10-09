import { Title } from '@mantine/core';

const WelcomeUser = () => {
  return (
    <>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 800,
        })}
      >
        Welcome!
      </Title>
    </>
  );
};
export default WelcomeUser;
