import { apply } from "../utils/twind.ts";

export const btnStyleWhite = apply`
  text-white
  bg-transparent
  hover:bg-gray-700
  font-medium
  rounded-lg
  text-sm
  px-5
  py-1.5
  w-40
`;

export const btnStyleBlue = apply`
  ext-white
  bg-blue-700
  hover:bg-blue-800
  focus:ring-4
  focus:ring-blue-300
  font-medium
  rounded-lg
  text-sm
  text-white
  px-5
  py-2.5
  w-40
`;
