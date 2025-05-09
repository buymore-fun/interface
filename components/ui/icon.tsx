import React from "react";
import { cn } from "@/lib/utils";

interface IconProps {
  name:
    | "switch"
    | "refresh"
    | "switch-v2"
    | "arrow-right"
    | "market"
    | "order"
    | "success"
    | "error"
    | "line-range";
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  switch (name) {
    case "switch":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className={cn("size-4", className)}
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M42 19H6M30 7l12 12M6.799 29h36m-36 0l12 12"
          />
        </svg>
      );
    case "market":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("size-4", className)}
        >
          <path
            fillRule="inherit"
            clipRule="inherit"
            d="M0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9ZM16 8.99995C16 12.8659 12.866 16 9 16C5.13401 16 2 12.8659 2 8.99995C2 5.13396 5.13401 1.99995 9 1.99995C12.866 1.99995 16 5.13396 16 8.99995ZM11 13.5002V12.0002H6V10.0002H14L11 13.5002ZM8 6V4.5L4 8H12V6H8Z"
            fill="currentColor"
          />
        </svg>
      );
    case "order":
      return (
        <svg
          width="16"
          height="18"
          viewBox="0 0 16 18"
          className={cn("size-4", className)}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="inherit"
            clipRule="inherit"
            fill="currentColor"
            d="M11.3848 2.25H12.9102C13.5005 2.25 14 2.78025 14 3.453V14.547C14 15.2212 13.5013 15.75 12.908 15.75H3.092C2.4995 15.75 2 15.2198 2 14.547V3.453C2 2.7795 2.4995 2.25 3.08975 2.25H4.61975C4.88773 2.25004 5.13536 2.1071 5.26936 1.87503C5.40337 1.64297 5.40337 1.35703 5.26936 1.12497C5.13536 0.892899 4.88773 0.749959 4.61975 0.75H3.08975C1.64975 0.75 0.5 1.97025 0.5 3.453V14.547C0.5 16.0275 1.6505 17.25 3.092 17.25H12.908C14.3503 17.25 15.5 16.0305 15.5 14.547V3.453C15.5 1.9725 14.3503 0.75 12.9102 0.75H11.3848C11.1168 0.749959 10.8691 0.892899 10.7351 1.12497C10.6011 1.35703 10.6011 1.64297 10.7351 1.87503C10.8691 2.1071 11.1168 2.25004 11.3848 2.25ZM7.25 2.25H8.75C9.16417 2.24994 9.49989 1.91417 9.49989 1.5C9.49989 1.08583 9.16417 0.750063 8.75 0.75H7.25C6.98202 0.749959 6.73439 0.892899 6.60039 1.12497C6.46638 1.35703 6.46638 1.64297 6.60039 1.87503C6.73439 2.1071 6.98202 2.25004 7.25 2.25ZM11 6H5C4.73202 6.00004 4.48439 5.8571 4.35039 5.62503C4.21639 5.39297 4.21639 5.10703 4.35039 4.87497C4.48439 4.6429 4.73202 4.49996 5 4.5H11C11.4142 4.50006 11.7499 4.83583 11.7499 5.25C11.7499 5.66417 11.4142 5.99994 11 6ZM5 9.75H11C11.4142 9.75 11.75 9.41421 11.75 9C11.75 8.58579 11.4142 8.25 11 8.25H5C4.58579 8.25 4.25 8.58579 4.25 9C4.25 9.41421 4.58579 9.75 5 9.75ZM11 13.5H5C4.58583 13.4999 4.25011 13.1642 4.25011 12.75C4.25011 12.3358 4.58583 12.0001 5 12H11C11.4142 12.0001 11.7499 12.3358 11.7499 12.75C11.7499 13.1642 11.4142 13.4999 11 13.5Z"
          />
        </svg>
      );
    case "success":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("size-4", className)}
        >
          <path
            d="M21 10V19.5C21 19.8978 20.842 20.2794 20.5607 20.5607C20.2794 20.842 19.8978 21 19.5 21H4.5C4.10218 21 3.72064 20.842 3.43934 20.5607C3.15804 20.2794 3 19.8978 3 19.5V4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 10L13 14L20.5 3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "error":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("size-4", className)}
        >
          <path
            d="M9.4 14L12 11.4L14.6 14L16 12.6L13.4 10L16 7.4L14.6 6L12 8.6L9.4 6L8 7.4L10.6 10L8 12.6L9.4 14ZM2 22V4C2 3.45 2.196 2.97933 2.588 2.588C2.98 2.19667 3.45067 2.00067 4 2H20C20.55 2 21.021 2.196 21.413 2.588C21.805 2.98 22.0007 3.45067 22 4V16C22 16.55 21.8043 17.021 21.413 17.413C21.0217 17.805 20.5507 18.0007 20 18H6L2 22ZM5.15 16H20V4H4V17.125L5.15 16Z"
            fill="currentColor"
          />
        </svg>
      );
    case "refresh":
      return (
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("size-4", className)}
        >
          <rect opacity="0.01" width="15" height="15" fill="currentColor" />
          <path
            d="M13.7452 3.73927C13.5008 3.65108 13.2311 3.77959 13.1455 4.024L12.7826 5.04198C12.3568 4.08196 11.684 3.23785 10.8273 2.60539C8.10348 0.589602 4.22308 1.1389 2.18209 3.83502C1.19436 5.14025 0.776081 6.74784 1.0079 8.36047C1.23971 9.98067 2.09894 11.4144 3.42181 12.3946C4.53049 13.2135 5.82816 13.6116 7.11574 13.6116C8.99799 13.6116 10.855 12.7675 12.067 11.1675C12.6037 10.4594 12.9691 9.66822 13.1581 8.81151C13.2135 8.55701 13.0522 8.30756 12.8003 8.25212C12.5483 8.19669 12.2963 8.35543 12.2409 8.60993C12.0821 9.33309 11.7722 10.0033 11.3187 10.6005C9.5876 12.8859 6.29431 13.3521 3.98119 11.6387C2.8599 10.8097 2.13422 9.59766 1.93768 8.22693C1.74114 6.86375 2.0939 5.50561 2.93046 4.40197C4.659 2.11656 7.94977 1.64789 10.2654 3.36131C11.1045 3.98117 11.7319 4.8404 12.0721 5.8105L10.4569 5.18056C10.215 5.08733 9.94289 5.20576 9.84714 5.44766C9.75139 5.68955 9.87233 5.96168 10.1142 6.05743L12.4929 6.98722C12.5483 7.00989 12.6063 7.01997 12.6642 7.01997C12.6718 7.01997 12.6793 7.01745 12.6869 7.01745C12.7045 7.01997 12.7222 7.02753 12.7398 7.02753C12.9338 7.02753 13.1152 6.90658 13.1833 6.71508L14.0299 4.34653C14.1156 4.09708 13.9896 3.82747 13.7452 3.73927Z"
            fill="currentColor"
          />
        </svg>
      );
    case "switch-v2":
      return (
        <svg
          width="30"
          height="20"
          viewBox="0 0 30 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("size-4", className)}
        >
          <g filter="url(#filter0_d_845_407)">
            <path
              d="M25 6H5M25 6L21.25 1M25 6L21.25 11M5 6L8.75 1M5 6L8.75 11"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              shapeRendering="crispEdges"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_845_407"
              x="0.5"
              y="0.5"
              width="29"
              height="19"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_845_407" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_845_407"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    case "arrow-right":
      return (
        <svg
          width="30"
          height="20"
          viewBox="0 0 30 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("size-4", className)}
        >
          <g filter="url(#filter0_d_836_3)">
            <path
              d="M25 6H5M25 6L20.3846 1M25 6L20.3846 11"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              shapeRendering="crispEdges"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_836_3"
              x="0.5"
              y="0.5"
              width="29"
              height="19"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_836_3" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_836_3"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      );
    case "line-range":
      return (
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24.375 17.5C23.7933 17.5 23.2779 17.3229 22.8288 16.9688C22.3796 16.6146 22.0888 16.1667 21.9563 15.625H3.125V14.375H21.9575C22.09 13.8333 22.3808 13.3854 22.83 13.0313C23.2792 12.6771 23.7942 12.5 24.375 12.5C25.075 12.5 25.6667 12.7417 26.15 13.225C26.6333 13.7083 26.875 14.2996 26.875 14.9987C26.875 15.6979 26.6333 16.2896 26.15 16.7737C25.6667 17.2579 25.075 17.5 24.375 17.5Z"
            fill="#26878D"
          />
        </svg>
      );
    default:
      return null;
  }
}

interface ChevronsUpDownProps {
  isOpen: boolean;
}

export function ChevronsUpDown({ isOpen }: ChevronsUpDownProps) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-4", isOpen ? "rotate-180" : "")}
    >
      <rect opacity="0.01" width="15" height="15" fill="currentColor" />
      <path
        d="M13.405 7.71886C13.2337 7.54749 12.9554 7.54749 12.784 7.71886L7.1903 13.3111C7.01893 13.4825 7.01893 13.7607 7.1903 13.9321C7.36167 14.1035 7.63996 14.1035 7.81133 13.9321L13.4036 8.33989C13.5764 8.16852 13.5764 7.89023 13.405 7.71886Z"
        fill="currentColor"
      />
      <path
        d="M7.82592 13.3126L2.23076 7.71739C2.05939 7.54602 1.7811 7.54602 1.60973 7.71739C1.43836 7.88876 1.43836 8.16706 1.60973 8.33843L7.20489 13.9336C7.37626 14.105 7.65455 14.105 7.82592 13.9336C7.99729 13.7622 7.99729 13.4839 7.82592 13.3126Z"
        fill="currentColor"
      />
      <path
        d="M13.405 1.06945C13.2337 0.898075 12.9554 0.898075 12.784 1.06945L7.1903 6.66167C7.01893 6.83304 7.01893 7.11134 7.1903 7.28271C7.36167 7.45408 7.63996 7.45408 7.81133 7.28271L13.4036 1.69048C13.5764 1.51911 13.5764 1.24082 13.405 1.06945Z"
        fill="currentColor"
      />
      <path
        d="M7.82592 6.66314L2.23076 1.06798C2.05939 0.896611 1.7811 0.896611 1.60973 1.06798C1.43836 1.23935 1.43836 1.51764 1.60973 1.68901L7.20489 7.28417C7.37626 7.45554 7.65455 7.45554 7.82592 7.28417C7.99729 7.1128 7.99729 6.83451 7.82592 6.66314Z"
        fill="currentColor"
      />
    </svg>
  );
}
