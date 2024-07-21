import { useState } from "react";

export default function useSequence(start: number = 0) {
  const [sequence, setSequence] = useState(start);
  return [sequence, () => setSequence((n) => n + 1)] as const;
}
