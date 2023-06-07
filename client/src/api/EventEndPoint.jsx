import { useAxios } from "@/lib/hooks/hooks";

export default function getEvents() {
  const api = useAxios();
  return api.get("/events/user-events/");
}
