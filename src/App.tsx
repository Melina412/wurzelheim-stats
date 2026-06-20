import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Landing } from "@/pages/Landing";
import { ClubStats } from "@/pages/ClubStats";
import { Generate } from "@/pages/Generate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/club/:id" element={<ClubStats />} />
          <Route path="/generate" element={<Generate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
