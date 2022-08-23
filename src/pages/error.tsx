import { Text } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import MainLayout from "../layouts";

const Home: NextPage = () => {
  return (
    <MainLayout title="Error" activePage="none">
      <Text weight="700" size={50} align="center">
        Woah, you shouldn&lsquo;t be here.
      </Text>
      <Text align="center" mt="lg">
        Sorry for this inconvenience it seems we&lsquo;re experiencing some
        problems.
      </Text>
      <Link href="/">
        <a>
          <Text align="center" mt="lg">
            Click here to go back to the home page.
          </Text>
        </a>
      </Link>
    </MainLayout>
  );
};

export default Home;
