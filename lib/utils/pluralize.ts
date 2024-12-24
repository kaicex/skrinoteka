export function pluralizeScreens(count: number): string {
  // Для чисел от 11 до 19 - особое склонение
  if (count % 100 >= 11 && count % 100 <= 19) {
    return `${count} экранов`;
  }

  // Для остальных чисел смотрим на последнюю цифру
  switch (count % 10) {
    case 1:
      return `${count} экран`;
    case 2:
    case 3:
    case 4:
      return `${count} экрана`;
    default:
      return `${count} экранов`;
  }
}
