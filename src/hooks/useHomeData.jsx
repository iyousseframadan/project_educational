import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API Endpoints
const HOME_SECTIONS_LIST_URL = "https://api-ed.zynqor.org/api/p/home";
const HOME_SECTION_DETAIL_URL = (key) =>
  `https://api-ed.zynqor.org/api/p/home/${key}`;

// Function to fetch all detailed home sections data
async function fetchAllHomeData() {
  console.log("fetchAllHomeData: Fetching section keys..."); // 1. جلب قائمة الـ keys أولاً
  const { data: listData } = await axios.get(
    `${HOME_SECTIONS_LIST_URL}?locale=ar`
  );

  if (!listData || !listData.sections || listData.sections.length === 0) {
    console.warn("fetchAllHomeData: No section keys found in API response.");
    return []; // نرجع مصفوفة فاضية لو مفيش keys
  }

  const sectionKeys = listData.sections.map((section) => section.key);
  console.log("fetchAllHomeData: Found section keys:", sectionKeys); // 2. جلب تفاصيل كل قسم بناءً على الـ key باستخدام Promise.all

  console.log("fetchAllHomeData: Fetching details for each section...");
  const detailPromises = sectionKeys.map((key) =>
    axios
      .get(`${HOME_SECTION_DETAIL_URL(key)}?locale=ar`)
      .then((response) => {
        // نتأكد إن الرد يحتوي على section
        if (response.data && response.data.section) {
          return {
            ...response.data.section,
            items: response.data.items || [], // نضمن وجود items كمصفوفة دائماً
          };
        } else {
          console.warn(
            `fetchAllHomeData: Invalid response structure for key: ${key}`,
            response.data
          );
          return null;
        }
      })
      .catch((error) => {
        console.error(
          `fetchAllHomeData: Error fetching details for section key: ${key}`,
          error.response?.data || error.message
        );
        return null; // نرجع null لو حصل خطأ
      })
  );

  const detailedSectionsResults = await Promise.all(detailPromises); // فلترة النتائج عشان نشيل أي nulls

  const validDetailedSections = detailedSectionsResults.filter(
    (section) => section !== null
  );

  console.log(
    "fetchAllHomeData: Fetched detailed sections (valid):",
    validDetailedSections
  );
  return validDetailedSections;
}

// The Custom Hook using React Query
export function useHomeData() {
  const {
    data: detailedSections,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["homeDataDetailed", "ar"], // Unique key for caching
    queryFn: fetchAllHomeData, // The async function to fetch data
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Cache kept for 10 minutes if inactive
    retry: 1, // Retry failed requests once
    refetchOnWindowFocus: false, // Don't refetch automatically when window gains focus
  });

  return { detailedSections, isLoading, error, isError };
}
// Usage Example:
// const { detailedSections, isLoading, error, isError } = useHomeData();
// if (isLoading) return <div>Loading...</div>;
// if (isError) return <div>Error: {error.message}</div>;
// console.log(detailedSections);