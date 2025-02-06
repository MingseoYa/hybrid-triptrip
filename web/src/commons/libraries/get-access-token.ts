import { gql, GraphQLClient } from "graphql-request";

// GraphQL Mutation 정의
const RESTORE_ACCESS_TOKEN = gql`
  mutation restoreAccessToken {
    restoreAccessToken {
      accessToken
    }
  }
`;

// RefreshToken을 사용해 AccessToken 재발급
export const getAccessToken = async ({ refreshToken }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // API URL 존재 여부 확인
  if (!apiUrl) {
    console.error("API URL is not defined in environment variables");
    return null;
  }

  try {
    // GraphQLClient 인스턴스 생성
    const graphQLClient = new GraphQLClient(apiUrl, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    // AccessToken 재발급 요청
    const result = await graphQLClient.request(RESTORE_ACCESS_TOKEN);
    const newAccessToken = result.restoreAccessToken.accessToken;

    console.log("New AccessToken issued:", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Failed to restore access token:", error);
    return null;
  }
};
