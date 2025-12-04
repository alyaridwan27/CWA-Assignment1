import { Suspense } from "react";
import EscapeRoomBuilder from "./../../../components/EscapeRoomBuilder";

export default function CreateEscapeRoomPage() {
  return (
    <Suspense fallback={<p>Loading builder...</p>}>
      <EscapeRoomBuilder />
    </Suspense>
  );
}
