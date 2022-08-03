import { Text } from "@mantine/core";
import type { NextPage } from "next";
import MainLayout from "../layouts";

const Home: NextPage = () => {
  return (
    <MainLayout title="Home">
      <Text weight="700" size={50} align="center">
        Hello Mohamed, <br /> How are you doing?
      </Text>
    </MainLayout>
  );
};

export default Home;
