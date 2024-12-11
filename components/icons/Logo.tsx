const Logo = ({ ...props }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="100%" height="100%" rx="16" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.003 1.0103C15.1736 1.0423 15.451 1.14897 15.611 1.24497C15.771 1.34097 15.9523 1.5223 16.0163 1.66097C16.0696 1.78897 16.123 2.01297 16.123 2.1623C16.123 2.31163 16.0696 2.55697 16.0056 2.72763C15.9416 2.88763 15.1736 3.87963 14.3096 4.93563C13.435 5.99163 12.027 7.6983 11.1736 8.7223C10.3203 9.7463 9.54163 10.7596 9.44563 10.9623C9.33896 11.165 9.24296 11.549 9.21096 11.8156C9.17896 12.1036 9.23229 12.509 9.33896 12.829C9.43496 13.1276 9.65896 13.5436 9.85096 13.7783C10.043 14.0023 10.4376 14.301 11.2696 14.6956L15.803 14.7063C19.8883 14.717 20.4003 14.7383 20.9763 14.9196C21.3923 15.0476 21.7976 15.2823 22.1496 15.581C22.4803 15.869 22.779 16.2636 23.2163 17.2023L23.2483 16.4023C23.2696 15.805 23.227 15.453 23.067 15.0156C22.9496 14.6956 22.6936 14.2156 22.5016 13.9596C22.3096 13.7036 21.8616 13.309 21.5096 13.0743C21.1576 12.8503 20.699 12.605 20.4963 12.541C20.2936 12.477 19.227 12.4023 16.123 12.349L16.3576 12.0396C16.4963 11.8796 17.595 10.5463 18.8003 9.08497C20.0056 7.62364 21.307 6.10897 21.6803 5.7143C22.0536 5.31963 22.5763 4.9143 22.843 4.7863C23.1523 4.64763 23.547 4.5623 23.963 4.5623C24.4643 4.5623 24.7416 4.6263 25.243 4.87163C25.6483 5.06363 26.107 5.41563 26.4696 5.8103C26.7896 6.1623 27.3016 6.8023 27.611 7.23963C27.9096 7.6663 28.4003 8.50897 28.6883 9.09563C28.987 9.6823 29.2963 10.4076 29.403 10.6956C29.499 10.9943 29.6696 11.5916 29.7763 12.029C29.8936 12.4663 30.0323 13.2343 30.0963 13.7356C30.1496 14.237 30.203 15.0476 30.203 15.549C30.203 16.0503 30.1496 16.861 30.0963 17.3623C30.043 17.8636 29.8936 18.653 29.7763 19.1223C29.6483 19.5916 29.3816 20.413 29.1683 20.9356C28.955 21.469 28.603 22.2263 28.3683 22.6423C28.1443 23.0583 27.707 23.7196 27.4083 24.1356C27.099 24.5516 26.395 25.341 25.8296 25.8956C25.275 26.4503 24.379 27.197 23.8563 27.549C23.323 27.901 22.5123 28.3703 22.043 28.605C21.5736 28.829 20.9016 29.1276 20.5496 29.2556C20.1976 29.3943 19.5043 29.597 19.003 29.7143C18.5016 29.8316 17.7123 29.9916 17.243 30.0556C16.7736 30.1303 16.2403 30.1516 16.0696 30.1196C15.899 30.077 15.6536 29.9703 15.5256 29.8636C15.4083 29.7676 15.2483 29.5756 15.1843 29.4476C15.1096 29.309 15.0563 29.085 15.0563 28.9356C15.0563 28.7863 15.1203 28.541 15.1843 28.381C15.259 28.2103 15.707 27.6236 16.1763 27.0583C16.6456 26.493 18.011 24.8503 19.2163 23.3996C20.4216 21.9596 21.5416 20.5303 21.7016 20.221C21.9256 19.7943 21.9896 19.517 21.9896 19.069C21.9896 18.7383 21.9043 18.2903 21.787 18.0556C21.6803 17.821 21.4776 17.4796 21.3283 17.309C21.1896 17.1383 20.827 16.8716 20.0163 16.4556L10.4163 16.349L9.82963 16.061C9.48829 15.901 9.05096 15.5596 8.78429 15.261C8.52829 14.9836 8.27229 14.589 8.19763 14.397C8.12296 14.205 8.03763 14.0556 7.99496 14.0556C7.94163 14.0556 7.90963 14.365 7.90963 14.749C7.90963 15.1756 7.99496 15.677 8.12296 16.061C8.25096 16.3916 8.52829 16.9143 8.75229 17.2023C8.97629 17.501 9.42429 17.8956 9.73363 18.0876C10.0536 18.269 10.5763 18.5036 10.8963 18.589C11.3016 18.6956 12.0056 18.749 13.1896 18.749C14.1283 18.749 14.9283 18.7703 14.9816 18.8023C15.0243 18.8343 14.939 18.9836 14.8003 19.1543C14.6616 19.3143 13.6483 20.5196 12.5496 21.8423C11.4616 23.165 10.1923 24.6476 9.74429 25.1383C9.22163 25.7036 8.73096 26.1303 8.38963 26.301C7.99496 26.5036 7.68563 26.5676 7.21629 26.5783C6.68296 26.5783 6.45896 26.5143 5.89363 26.205C5.49896 26.0023 4.97629 25.5863 4.66696 25.245C4.36829 24.925 3.87763 24.2956 3.57896 23.8583C3.26963 23.4316 2.81096 22.6423 2.54429 22.109C2.27763 21.5863 1.91496 20.7223 1.74429 20.189C1.56296 19.6663 1.34963 18.845 1.26429 18.3756C1.16829 17.9063 1.06163 17.021 1.02963 16.4023C0.976293 15.7303 0.997626 14.8023 1.07229 14.109C1.14696 13.469 1.32829 12.4556 1.47763 11.869C1.62696 11.2823 1.91496 10.4183 2.11763 9.94897C2.32029 9.47963 2.62963 8.82897 2.81096 8.50897C2.98163 8.18897 3.39763 7.54897 3.72829 7.07963C4.06963 6.62097 4.69896 5.8743 5.13629 5.4263C5.58429 4.9783 6.33096 4.32763 6.78963 3.97563C7.25896 3.62363 8.00563 3.13297 8.44296 2.87697C8.88029 2.63163 9.72296 2.23697 10.3096 2.0023C10.8963 1.7783 11.7923 1.4903 12.315 1.37297C12.827 1.24497 13.563 1.1063 13.9683 1.05297C14.363 0.999635 14.8323 0.988968 15.003 1.0103ZM19.547 1.9063L20.2616 2.18363C20.6563 2.33297 21.0616 2.47163 21.1576 2.49297C21.2643 2.5143 21.3496 2.56763 21.3496 2.62097C21.3496 2.66363 20.603 3.61297 19.6963 4.7223C18.779 5.8423 16.9976 8.00763 13.4563 12.349H12.5176C12.0056 12.349 11.483 12.3276 11.355 12.2956C11.2163 12.2636 11.1096 12.1996 11.1096 12.1356C11.1096 12.0823 11.867 11.133 12.795 10.0236C13.7123 8.92497 15.611 6.6423 17.0083 4.96763L19.547 1.9063ZM17.7763 18.7383L18.811 18.7703C19.4083 18.7916 19.899 18.8556 19.9843 18.9196C20.091 19.0263 20.0056 19.1863 19.5363 19.741C19.2163 20.125 17.6056 22.0663 15.963 24.0396C14.3203 26.0236 12.6776 27.9863 11.643 29.2023L10.9176 28.925C10.523 28.7756 10.1176 28.6263 10.011 28.605C9.91496 28.5836 9.82963 28.5196 9.82963 28.477C9.82963 28.4343 10.6296 27.4316 11.611 26.2583C12.5923 25.085 14.3843 22.909 15.5896 21.4263L17.7763 18.7383Z"
      fill="#211D1E"
    />
  </svg>
);

export default Logo;
