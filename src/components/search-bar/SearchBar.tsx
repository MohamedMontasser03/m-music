import { ActionIcon, Autocomplete } from "@mantine/core";
import Router from "next/router";
import { useEffect, useState } from "react";
import { Search } from "tabler-icons-react";
import { trpc } from "../../utils/trpc";

type Props = {
  defaultQuery?: string;
};

export const SearchBar: React.FC<Props> = ({ defaultQuery }) => {
  const [search, setSearch] = useState(defaultQuery ?? "");
  const { data: searchKeys, refetch } = trpc.useQuery(
    ["recommendation.search.suggestions", { query: search }],
    {
      enabled: false,
      ssr: false,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch, search]);

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    Router.push(`/search?q=${value}`);
  };

  return (
    <div
      style={{
        maxWidth: 400,
      }}
    >
      <Autocomplete
        data={searchKeys ?? []}
        placeholder="Search"
        mt="md"
        px="lg"
        value={search}
        onChange={(value) => {
          setSearch(value);
        }}
        onItemSubmit={onSuggestionsFetchRequested}
        onKeyUp={(e) => {
          const value = e.currentTarget.value;
          if ((e.key === "Enter" || e.keyCode === 13) && value !== "") {
            onSuggestionsFetchRequested({ value: e.currentTarget.value });
          }
        }}
        rightSection={
          <ActionIcon
            onClick={() => onSuggestionsFetchRequested({ value: search })}
            variant="transparent"
          >
            <Search />
          </ActionIcon>
        }
      />
    </div>
  );
};
