import { apply } from "../utils/twind.ts";

export const textareaStyle = apply`
  block
  p-2.5
  w-full
  h-60
  ext-sm
  text-gray-900
  bg-gray-50
  rounded-lg
  border
  border-gray-300
  focus:ring-blue-500
  focus:border-blue-500
  dark:bg-gray-700
  dark:border-gray-600
  dark:placeholder-gray-400
  dark:text-white
  dark:focus:ring-blue-500
  dark:focus:border-blue-500
  font-sans
`;

export const btnStyleBlack = apply`
  text-white
  bg-gray-800
  hover:bg-gray-900
  focus:outline-none
  focus:ring-4
  focus:ring-gray-300
  font-medium
  rounded-lg
  text-sm
  px-5
  py-2.5
  w-40
  dark:bg-gray-800
  dark:hover:bg-gray-700
  dark:focus:ring-gray-700
  dark:border-gray-700
`;

export const btnStyleWhite = apply`
  text-gray-900
  bg-white
  border
  border-gray-300
  focus:outline-none
  hover:bg-gray-100
  focus:ring-4
  focus:ring-gray-200
  font-medium
  rounded-lg
  text-sm
  px-5
  py-2.5
  w-40
  dark:bg-gray-800
  dark:text-white
  dark:border-gray-600
  dark:hover:bg-gray-700
  dark:hover:border-gray-600
  dark:focus:ring-gray-700
`;
