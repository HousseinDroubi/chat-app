import { useQuery } from "@tanstack/react-query";

export const useGetUser = () =>
  useQuery({
    queryKey: ["User"],
    initialData: {
      _id: "",
      username: "username",
      profile_url: null,
      token: null,
      users: [],
      messages: [],
    },
    gcTime: Infinity,
    staleTime: Infinity,
  });
