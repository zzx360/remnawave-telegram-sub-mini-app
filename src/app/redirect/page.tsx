'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './redirect.module.css'

type Language = 'en' | 'ru' | 'fa' | 'zh'

const appIcons: Record<string, string> = {
  'happ': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M13.4,19.6l-7.9,7.9L5,30.4h6.6L13.4,19.6z" /><path d="M13.2,13.5L14.6,5l-7.9,7.9L4.2,27.4l7.9-7.9l0.2-1.2h1l4.9-4.9H13.2z" /><path d="M25.4,19.6L27.8,5l-7.9,7.9l-0.1,0.7h-0.6l-4.9,4.9h4.7l-1.5,9L25.4,19.6z" /><path d="M18.7,27.5l-0.5,2.9h6.6l1.8-10.8L18.7,27.5z" /><path d="M13.6,4.9l0.6-3.3H7.5L5.6,12.8L13.6,4.9z" /><path d="M18.8,12.8l7.9-7.9l0.6-3.3h-6.6L18.8,12.8z" /></svg>`,
  'sing-box': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M28.845 22.699c.608-.37.998-1.235 1-1.854V11.2s.008-.403-.417-.673L16.825 2.649s-1.48-.95-2.921 0L2.407 10.324c-.536.37-.558 1.036-.558 1.036l-.004 9.339s-.013 1.171.5 1.5l12.5 8 .048-11-12.158-7.694s-.556-.351.158-.76L14.345 3.2c1.032-.628 2.06-.03 2.06-.03l12.556 7.687c.604.254.158.444.158.444l-2.849 1.805s-.404.357-.888.112L12.356 5.134l-.48.316 13.47 8.249v3.5a.93.93 0 0 1-.362.745l-3.777 2.515s-.348.25-.362-.26v-3.5L7.43 8.359l-.542.369 13.036 8.158s.384.207-.056.446l-3.32 1.982v9.885s-.002.637-.702 1c0 0 .521.128 1.467-.432z"/></svg>`,
  'streisand': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M19.744 7.308c1.486-1.04 2.95-2.07 4.422-3.088.566-.392 1.131-.795 1.74-1.12.252-.137.625-.142.924-.095.185.028.424.246.471.42.041.152-.104.417-.251.536-.533.433-1.097.832-1.658 1.233-1.407 1.004-2.818 2.002-4.309 3.06.62.394 1.187.769 1.77 1.122.653.396.663.393 1.297-.063 1.596-1.15 3.18-2.314 4.786-3.45.276-.195.629-.341.965-.39.193-.027.54.143.606.303.073.18-.015.535-.17.666-.758.64-1.55 1.242-2.35 1.834-1.047.775-2.113 1.528-3.23 2.334.236.168.453.303.644.465.532.451 1.12.86 1.56 1.383.662.785.694 1.785.684 2.737-.014 1.28-.108 2.56-.224 3.836-.06.662-.573 1.11-1.053 1.536-.26.23-.56.42-.855.611-.3.195-.273.354.004.55 1.28.905 2.556 1.817 3.828 2.734.345.248.678.514 1.005.784.222.184.404.403.237.705-.165.299-.469.457-.784.364a3.595 3.595 0 0 1-1.006-.51c-1.432-.998-2.846-2.02-4.272-3.026a2.806 2.806 0 0 0-.585-.31c-.302-.12-.556-.166-.86.123-.402.383-.911.666-1.388.973-.29.187-.22.324.012.484 1.398.971 2.808 1.927 4.182 2.927.543.395 1.25.644 1.503 1.343l.06.168c-.249.125-.48.254-.722.36-.35.153-.638-.02-.91-.201-1.221-.816-2.438-1.637-3.66-2.452-.644-.43-1.3-.843-1.944-1.276-.232-.157-.391-.12-.621.038-.843.579-1.646 1.221-2.666 1.526-1.01.303-1.946.133-2.82-.38a21.5 21.5 0 0 1-1.688-1.112c-.297-.214-.53-.222-.83-.011-1.491 1.04-2.994 2.068-4.494 3.098-.303.208-.586.467-.922.597-.31.119-.683.135-1.022.114-.158-.01-.424-.214-.426-.334-.004-.225.078-.537.246-.667.778-.597 1.598-1.143 2.403-1.708.949-.665 1.9-1.33 2.847-1.998.127-.09.24-.195.39-.32l-1.404-1.005c-.183-.13-.353-.295-.558-.38-.43-.176-.766.08-1.081.303-1.548 1.09-3.08 2.2-4.64 3.276-.259.179-.621.285-.94.296-.186.006-.466-.21-.544-.39-.063-.144.051-.46.195-.57 1.143-.877 2.31-1.725 3.471-2.58.473-.348.946-.696 1.424-1.036.227-.161.227-.314.022-.485-.246-.206-.47-.444-.74-.615-.923-.584-1.233-1.457-1.254-2.443a90.785 90.785 0 0 1 0-4.112c.022-.935.463-1.693 1.248-2.265.415-.301.817-.619 1.223-.93.223-.171.254-.277-.03-.474-1.638-1.14-3.257-2.306-4.878-3.47a4.595 4.595 0 0 1-.527-.46c-.426-.417-.33-.827.27-.922.3-.047.7.043.948.213 1.396.95 2.758 1.946 4.133 2.923.443.315.897.613 1.333.936.305.226.552.018.768-.104.485-.272.934-.6 1.4-.903.367-.238.382-.335.03-.59C8.735 6.71 6.984 5.45 5.236 4.187c-.024-.017-.05-.03-.075-.048-.308-.22-.604-.465-.438-.879.117-.291.795-.464 1.16-.276.483.248.946.538 1.388.847a508.895 508.895 0 0 1 4.557 3.233c.247.177.466.212.727.038.378-.251.792-.459 1.147-.736 1.327-1.037 3.255-1.016 4.883.146.38.272.771.53 1.16.796zm-3.486 13.251a3.825 3.825 0 0 0 2.517-.692c2.212-1.544 4.404-3.113 6.642-4.622 1.355-.914 1.328-2.708.124-3.616-.642-.484-1.338-.902-2.005-1.358-1.299-.886-2.61-1.755-3.887-2.672-1.205-.867-2.462-1.574-4.04-1.338-.606.091-1.28.208-1.766.53-2.342 1.56-4.617 3.213-6.945 4.793-1.392.945-1.293 2.726-.093 3.61.856.631 1.768 1.193 2.651 1.791 1.254.85 2.522 1.682 3.752 2.562.913.652 1.876 1.092 3.05 1.012zm-3.646 3.53c.131.132.847.62 1.168.827.503.323.989.178 1.06-.388.077-.614.098-1.26-.024-1.862-.077-.377-.387-.798-.721-1.027-2.463-1.687-4.957-3.333-7.445-4.988-.522-.347-1.01-.196-1.084.394a6.33 6.33 0 0 0 .02 1.822c.057.347.33.706.604.96.36.334.81.583 1.24.84.106.062.213-.079.279-.141-.397-.39-.633-.531-1.053-.773-.542-.312-.768-.792-.822-1.35a4.932 4.932 0 0 1 .039-1.11c.071-.537.223-.592.676-.29l7.016 4.68c.955.636 1.317 1.72.935 2.785-.102.285-.258.36-.529.162-.26-.191-.683-.513-.968-.665-.108-.059-.145.124-.391.124zm6.435.194c-.004-.052-.323-.17-.442-.111-.236.119-.442.289-.665.431-.347.223-.512.175-.567-.227-.06-.435-.132-.897-.039-1.315.087-.393.282-.873.599-1.091 2.48-1.71 5-3.364 7.504-5.043.31-.207.5-.114.533.192.053.493.082.996.037 1.487-.046.504-.34.893-.81 1.166-.39.227-.753.498-1.128.75.008.047.325.173.43.114.32-.18.605-.417.924-.6.671-.381.935-.981.988-1.679a5.21 5.21 0 0 0-.046-1.11c-.114-.814-.546-.989-1.247-.522L18 21.475c-1.004.67-1.416 2.12-.914 3.21.195.424.529.53.935.28.35-.217.685-.454 1.027-.682zm-7.498-1.273c-.743-.497-1.481-1-2.236-1.48-.087-.055-.226.106-.362.12.732.592 1.428 1.096 2.157 1.564.109.07.43-.149.44-.204zm8.787-.002c.002.048.31.194.403.134.74-.472 1.466-.965 2.197-1.451-.008-.04-.339-.176-.436-.114-.73.464-1.445.951-2.164 1.431z"/></svg>`,
  'shadowrocket': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M26.76 23.819 20.1 22.658c-.837 1.628-2.32 2.309-4.238 2.302-1.91-.007-3.417-.646-4.3-2.344-2.183.385-4.39.77-6.734 1.182.061-.817.084-1.587.19-2.35.26-1.835 1.081-3.443 2.512-4.79.25-.233.357-.48.335-.845-.19-3.113.182-6.157 1.521-9.05a14.638 14.638 0 0 1 4.513-5.6c.51-.385 1.057-.729 1.628-1.017.205-.103.601-.083.807.027 1.3.742 2.473 1.65 3.424 2.728 1.118 1.265 2.031 2.667 2.678 4.192 1.164 2.763 1.59 5.614 1.4 8.549-.03.432.084.762.434 1.099 1.81 1.711 2.519 3.82 2.541 6.143 0 .268.008.543.016.811.007.014-.008.028-.069.124zm-1.827-1.814c.038-.103.053-.13.053-.158a.815.815 0 0 0 0-.193c-.114-1.903-.844-3.56-2.374-4.906-.16-.138-.327-.364-.32-.543.115-1.828.19-3.656-.38-5.442-.32-1.004-.548-2.041-.99-2.997-.958-2.075-2.312-3.91-4.397-5.229-.624-.399-.685-.399-1.294.028-2.58 1.786-4.185 4.157-5.068 6.947-.654 2.089-.814 4.22-.639 6.377.03.371-.091.625-.388.873-.867.707-1.46 1.587-1.856 2.577a7.172 7.172 0 0 0-.518 2.597l5.73-1.024c.122.227.22.433.335.626.631 1.044 1.598 1.642 2.93 1.683 1.377.041 2.396-.522 3.104-1.58.434-.653.434-.653 1.278-.502.038.007.069.014.107.02l4.687.846zM15.802 34c-1.126-1.546-2.222-3.03-2.55-4.824-.243-1.326.617-2.604 1.941-3.058.898-.31 1.918.02 2.587.81.624.743.822 1.595.632 2.482-.373 1.718-1.415 3.147-2.61 4.59zm-.099-2.24c.107 0 .213 0 .312-.007.342-.756.715-1.498 1.027-2.268.229-.563.023-1.1-.327-1.58-.373-.523-1.05-.57-1.545-.138-.449.392-.7.9-.525 1.43.297.865.7 1.704 1.058 2.563z"/><path d="M15.772 7.647c1.955-.048 3.477 1.374 3.485 2.996.007 1.738-1.492 3.12-3.387 3.127-1.894.006-3.332-1.327-3.393-3.058-.054-1.498 1.575-3.148 3.295-3.065zm1.94 3.106C17.727 9.79 16.928 9.014 15.9 9c-1.065-.014-2.009.742-1.994 1.724.015.949.822 1.698 1.865 1.711 1.103.007 1.925-.7 1.94-1.683z"/></svg>`,
  'clash-meta': `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.1 35.17H5.686m9.282 2.993l-8.846 3.163M24 16.874c.801 0 2.551.256 2.551.256L37.746 6.674s3.295.341 4.754.852V31.63c-1.42.653-4.574 1.108-6.45 1.108V17.11l-7.756 7.302S25.708 23.560 24 23.560s-4.294.853-4.294.853L11.95 17.11v15.627c-1.876 0-5.03-.455-6.45-1.108V7.526c1.458-.511 4.754-.852 4.754-.852L21.45 17.13s1.75-.256 2.551-.256m.625 17.245L24 35.265l-.626-1.146M32.9 35.17h9.414m-9.282 2.993l8.846 3.163"/></svg>`,
  'v2rayng': `<svg viewBox=\"0 0 32 32\" fill=\"currentColor\"><path d=\"M0 1.86298V3.72596H1.87780H3.75560L3.80567 17.3630L3.88078 31L18.4024 15.6987C26.3893 7.30288 32.9741 0.322916 32.9992 0.198717C33.0492 0.0993585 30.8460 -4.76837e-07 28.1169 -4.76837e-07H23.1595L16.2742 6.38381L9.38899 12.7428L9.26380 6.43349L9.13862 0.124198L4.58183 0.049679L0 -4.76837e-07V1.86298Z\"/></svg>`,
  'clash-verge-rev': `<svg viewBox="0 0 22 22" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.007 22C6.01025 22 0.413848 19.6085 0.0141045 14.2017C-0.0891418 12.8053 0.393020 11.8257 0.853709 10.8897C0.907577 10.7802 0.961152 10.6714 1.01346 10.5625C0.347223 7.78979 -0.385635 1.82844 2.01282 0.164802C3.51185 -0.874970 7.00960 3.28412 8.00897 4.84377C9.00832 4.32389 10.5074 4.32389 11.0070 4.32389C12.0064 4.32389 12.5061 4.32389 14.0051 4.84377C15.1710 3.11082 18.0026 -0.251107 20.0013 0.164802C22.0654 0.594314 21.4010 6.70141 21.1077 9.39799C21.0459 9.96537 21.0006 10.3818 21.0006 10.5625C21.0864 10.7409 21.1721 10.9040 21.2553 11.0623C21.6571 11.8266 22.0000 12.4790 22.0000 14.2017C22.0000 16.2813 19.0019 22.0000 11.0070 22.0000ZM8.86995 16.1663C8.39444 16.9904 6.84049 16.9834 5.39910 16.1507C3.95771 15.3180 3.17471 13.9749 3.65022 13.1507C4.12573 12.3266 5.67969 12.3336 7.12107 13.1663C8.56246 13.9990 9.34546 15.3421 8.86995 16.1663ZM18.0871 13.1507C18.5626 13.9749 17.7796 15.3180 16.3382 16.1507C14.8968 16.9834 13.3429 16.9904 12.8674 16.1663C12.3919 15.3421 13.1749 13.9990 14.6163 13.1663C16.0576 12.3336 17.6116 12.3266 18.0871 13.1507ZM11.0070 19.1585C10.0077 19.1585 8.14148 17.6696 9.50800 17.6585H12.5061C14.0051 17.6585 12.0064 19.1585 11.0070 19.1585Z"/></svg>`,
  'flclash': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M15.215 31.645a3.15 3.15 0 0 1-2.527-1.747c-.293-.585-.376-.988-.34-1.68.047-.866.355-1.542.984-2.144a3.168 3.168 0 0 1 2.23-.883c.954 0 1.653.286 2.301.934.64.64.946 1.379.95 2.297.003.91-.305 1.652-.958 2.308-.695.696-1.628 1.02-2.64.915Z"/><path d="M6.254 16.5a3.232 3.232 0 0 1-2.645-3.215c0-1.316.637-2.246 2.098-3.078l8.719-5.031C18.824 2.636 22.594.496 22.8.422c.777-.281 1.691-.223 2.504.164.515.242 1.199.934 1.453 1.465.336.707.422 1.379.27 2.094-.137.652-.4 1.12-.9 1.617-.421.418-.644.55-5.183 3.168-2.918 1.68-5.84 3.363-8.758 5.047-2.554 1.476-4.14 2.359-4.363 2.425a3.465 3.465 0 0 1-1.57.098Z"/><path d="M10.363 23.996c-.511-.137-.996-.43-1.437-.867-1.285-1.27-1.281-3.27.004-4.54.386-.378.718-.581 4.851-2.96 2.442-1.406 4.59-2.617 4.778-2.691 2.054-.833 4.367.734 4.386 2.968.008.938-.28 1.64-.949 2.305-.422.418-.617.539-4.746 2.918-4.68 2.695-4.738 2.726-5.203 2.863-.395.117-1.254.117-1.684.004Z"/></svg>`,
  'hiddify': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M26.8191 2.1691C25.0243 3.36662 23.3928 4.49636 23.2092 4.67711C22.6993 5.17420 22.6789 8.38265 23.1684 8.90233C23.6375 9.44461 30.2046 9.44461 30.6737 8.90233C30.9388 8.60860 31.0000 7.88557 31.0000 4.63192C31.0000 1.37828 30.9388 0.655248 30.6737 0.361516C30.5105 0.158163 30.3066 0 30.2250 0C30.1434 0 28.6138 0.971575 26.8191 2.1691Z" /><path d="M15.3980 9.39942C13.6033 10.5969 11.9717 11.7267 11.7882 11.9074C11.4618 12.2464 11.4211 12.8338 11.4211 18.1888C11.4211 22.4818 11.3599 24.1538 11.1763 24.3571C10.8500 24.7187 8.72895 24.7187 8.40263 24.3571C8.23947 24.1764 8.15789 22.8885 8.15789 20.0867C8.15789 16.6749 8.11711 16.0197 7.83158 15.7034C7.64803 15.5000 7.36250 15.3870 7.17895 15.4774C6.70987 15.6808 1.40724 19.2055 0.673026 19.8156L0 20.3579V25.3061C0 29.4862 0.0407895 30.2996 0.326316 30.5933C0.591447 30.8870 1.22368 30.9548 4.07895 30.9548C8.21908 30.9548 8.15789 31.0000 8.15789 28.6050C8.15789 27.6334 8.25987 26.8652 8.40263 26.7070C8.72895 26.3455 10.8500 26.3455 11.1763 26.7070C11.3191 26.8652 11.4211 27.6334 11.4211 28.6050C11.4211 31.0000 11.3599 30.9548 15.5000 30.9548C18.3553 30.9548 18.9875 30.8870 19.2526 30.5933C19.5382 30.2770 19.5789 28.9213 19.5789 19.0926C19.5789 9.26385 19.5382 7.90817 19.2526 7.59184C19.0895 7.38849 18.8855 7.23032 18.8039 7.23032C18.7224 7.23032 17.1928 8.20190 15.3980 9.39942Z" /><path d="M23.1684 11.4329C22.8829 11.7267 22.8421 12.9242 22.8421 21.0131C22.8421 29.1020 22.8829 30.2996 23.1684 30.5933C23.6375 31.1356 30.2046 31.1356 30.6737 30.5933C30.9592 30.2996 31.0000 29.1020 31.0000 21.0131C31.0000 12.9242 30.9592 11.7267 30.6737 11.4329C30.4086 11.1392 29.7763 11.0714 26.9211 11.0714C24.0658 11.0714 23.4336 11.1392 23.1684 11.4329Z" /></svg>`,
  'exclave': `<svg viewBox="0 0 32 32" fill="currentColor"><path d="M10.238 28.828c-1.39-.144-3.39-.8-3.718-1.215-.16-.207-.176-.363-.176-1.593 0-.754.035-1.391.078-1.418.047-.028.387.152.754.398 1.414.945 2.539 1.285 4.258 1.29 1.02.003 1.308-.028 1.875-.204a7.706 7.706 0 0 0 3.914-2.766c.734-.996 1.082-1.8 1.32-3.078.117-.613.117-.77 0-1.344-.492-2.375-1.898-4.054-3.93-4.691-.66-.207-1.836-.18-2.504.059-1.234.441-2.207 1.25-2.668 2.222-.242.512-.285.703-.285 1.278 0 .578.04.754.293 1.265.317.64.926 1.266 1.512 1.551.52.254 1.434.277 1.875.055.61-.313 1.191-1.11 1.32-1.817.172-.91-.64-1.953-1.523-1.953-.27 0-.395.07-.695.383-.204.21-.512.582-.684.828-.262.367-.367.45-.625.469-.504.043-.672-.145-.664-.754.012-.996.601-1.863 1.547-2.293.636-.285 1.851-.266 2.523.043 1.406.652 2.043 2.008 2.043 4.355 0 2.004-.578 2.848-2.277 3.32-.918.259-2.399.278-3.262.048-1.812-.489-3-1.625-3.637-3.485-.226-.664-.246-.832-.246-2.02.004-1.179.028-1.363.258-2.054.379-1.133.746-1.762 1.406-2.418.684-.68 1.72-1.242 2.7-1.469 1.472-.34 3.464-.336 4.835.008 1.715.43 3.344 1.738 4.274 3.434 1.512 2.758 1.344 6.918-.383 9.457-.973 1.437-2.305 2.511-4.043 3.265-1.16.5-2.02.73-3.21.852-.997.102-1.235.102-2.255-.008Z"/><path d="M22.02 28.418c-.31-.074-.774-.484-.903-.793-.172-.41-.16-1.41.02-1.79.078-.167.265-.39.41-.495.25-.176.363-.188 2.015-.172.961.008 1.782.039 1.82.062.044.024.075.727.075 1.563v1.516l-.227.086c-.23.085-2.87.105-3.21.023Z"/><path d="M27.621 26.48l.027-1.91.293-.367c.743-.922.954-1.785.887-3.629-.058-1.62-.215-2.41-.762-3.828l-.418-1.082-.054-6.969.277.313c1.188 1.344 2.82 4.656 3.48 7.058.708 2.57.82 6.164.27 8.375-.379 1.497-1.305 2.868-2.293 3.391-.496.262-1.351.559-1.613.559-.102 0-.117-.336-.094-1.91Z"/><path d="M3.438 25.496c-1.016-1.035-1.602-1.933-2.278-3.492-.707-1.625-.972-2.762-1.117-4.777-.121-1.665.281-4.286.902-5.918.688-1.805 1.371-2.93 2.387-3.946.559-.554.727-.676.785-.57.04.07.082 1 .094 2.062l.016 1.93-.5 1.008c-.872 1.75-1.192 3.242-1.114 5.152.063 1.446.27 2.23.985 3.72l.554 1.163.028 2.121c.02 1.574 0 2.121-.078 2.121-.055 0-.356-.258-.665-.574Z"/><path d="M24.934 10.875c-.168-.242-.633-.754-1.036-1.133-2.89-2.726-6.75-4.035-11.066-3.762-2.043.13-3.496.567-4.95 1.485-1.241.785-1.35.848-1.448.785-.055-.035-.09-.586-.09-1.441 0-1.63.05-1.79.687-2.09 1.328-.625 3.844-1.399 5.387-1.653 1.836-.304 4.367-.265 6.133.094 1.789.363 4.277 1.414 5.742 2.422 1.215.836 1.18.73 1.148 3.352-.015 1.32-.062 2.246-.117 2.296-.058.06-.191-.062-.39-.355Z"/></svg>`,
  'obtainium': `<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M6,18c0,0.55 0.45,1 1,1h1v3.5c0,0.83 0.67,1.5 1.5,1.5s1.5,-0.67 1.5,-1.5V19h2v3.5c0,0.83 0.67,1.5 1.5,1.5s1.5,-0.67 1.5,-1.5V19h1c0.55,0 1,-0.45 1,-1V8H6v10zM3.5,8C2.67,8 2,8.67 2,9.5v7c0,0.83 0.67,1.5 1.5,1.5S5,17.33 5,16.5v-7C5,8.67 4.33,8 3.5,8zM20.5,8C19.67,8 19,8.67 19,9.5v7c0,0.83 0.67,1.5 1.5,1.5s1.5,-0.67 1.5,-1.5v-7C22,8.67 21.33,8 20.5,8zM15.53,2.16l1.3,-1.3c0.2,-0.2 0.2,-0.51 0,-0.71c-0.2,-0.2 -0.51,-0.2 -0.71,0l-1.48,1.48C13.85,1.23 12.95,1 12,1c-0.96,0 -1.86,0.23 -2.66,0.63L7.85,0.15c-0.2,-0.2 -0.51,-0.2 -0.71,0c-0.2,0.2 -0.2,0.51 0,0.71l1.31,1.31C6.97,3.26 6,5.01 6,7h12C18,5.01 17.03,3.25 15.53,2.16zM10,5H9V4h1V5zM15,5h-1V4h1V5z\"/></svg>`,
  'default': `<svg viewBox="0 0 32 32" fill="currentColor"><rect width="32" height="32" rx="8" fill="#3b82f6"/><path d="M22.667 10.667L13.333 20l-5.333-5.333 1.88-1.88 3.453 3.453 7.454-7.453 1.88 1.88z" fill="#fff"/></svg>`
}

interface AppScheme {
  scheme: string
  id: string
  name: Record<Language, string>
}

const appSchemes: AppScheme[] = [
  { scheme: 'happ://', id: 'happ', name: { en: 'Happ', ru: 'Happ', fa: 'Happ', zh: 'Happ' } },
  { scheme: 'flclash://', id: 'flclash', name: { en: 'FlClash', ru: 'FlClash', fa: 'FlClash', zh: 'FlClash' } },
  { scheme: 'clash://', id: 'clash-meta', name: { en: 'Clash', ru: 'Clash', fa: 'Clash', zh: 'Clash' } },
  { scheme: 'sing-box://', id: 'sing-box', name: { en: 'sing-box', ru: 'sing-box', fa: 'sing-box', zh: 'sing-box' } },
  { scheme: 'streisand://', id: 'streisand', name: { en: 'Streisand', ru: 'Streisand', fa: 'Streisand', zh: 'Streisand' } },
  { scheme: 'v2rayng://', id: 'v2rayng', name: { en: 'v2rayNG', ru: 'v2rayNG', fa: 'v2rayNG', zh: 'v2rayNG' } },
  { scheme: 'exclave://', id: 'exclave', name: { en: 'Exclave', ru: 'Exclave', fa: 'Exclave', zh: 'Exclave' } },
  { scheme: 'sub://', id: 'shadowrocket', name: { en: 'Shadowrocket', ru: 'Shadowrocket', fa: 'Shadowrocket', zh: 'Shadowrocket' } },
  { scheme: 'hiddify://', id: 'hiddify', name: { en: 'Hiddify', ru: 'Hiddify', fa: 'Hiddify', zh: 'Hiddify' } },
  { scheme: 'obtainium://', id: 'obtainium', name: { en: 'Obtainium', ru: 'Obtainium', fa: 'Obtainium', zh: 'Obtainium' } }
]

const translations: Record<Language, Record<string, string>> = {
  en: {
    settings: 'Settings', theme: 'Theme', language: 'Language', light: 'Light', dark: 'Dark', auto: 'Auto',
    seconds: 'seconds', redirecting_to: 'Redirecting to', you_will_be_redirected: 'You will be redirected automatically in',
    if_not: 'If nothing happens, click the button below.', proceed: 'Import', error_redirect: 'Redirection Error',
    error_description: 'The redirection link is missing or invalid.',
    obtainium_info: "If this didn't happen, you may not have the Obtainium app installed. Download it from GitHub or F-Droid and try clicking the Import button below.",
    download_github: 'Download (GitHub)', download_fdroid: 'Download (F-Droid)'
  },
  ru: {
    settings: 'Настройки', theme: 'Тема', language: 'Язык', light: 'Светлая', dark: 'Тёмная', auto: 'Авто',
    seconds: 'секунд', redirecting_to: 'Перенаправление в', you_will_be_redirected: 'Вы будете автоматически перенаправлены через',
    if_not: 'Если этого не произошло, нажмите кнопку ниже.', proceed: 'Импортировать', error_redirect: 'Ошибка перенаправления',
    error_description: 'Ссылка для перенаправления отсутствует или недействительна.',
    obtainium_info: 'Если этого не произошло, возможно у вас не загружено приложение Obtainium. Загрузите его в GitHub или F-Droid и попробуйте нажать кнопку Импортировать ниже.',
    download_github: 'GitHub', download_fdroid: 'F-Droid'
  },
  fa: {
    settings: 'تنظیمات', theme: 'پوسته', language: 'زبان', light: 'روشن', dark: 'تیره', auto: 'خودکار',
    seconds: 'ثانیه', redirecting_to: 'در حال هدایت به', you_will_be_redirected: 'شما به طور خودکار هدایت خواهید شد در',
    if_not: 'اگر اتفاقی نیفتاد، دکمه زیر را کلیک کنید.', proceed: 'وارد کردن', error_redirect: 'خطای هدایت',
    error_description: 'لینک هدایت وجود ندارد یا نامعتبر است.',
    obtainium_info: 'اگر این اتفاق نیفتاد، ممکن است برنامه Obtainium را نصب نکرده باشید. آن را از GitHub یا F-Droid دانلود کرده و روی دکمه وارد کردن در پایین کلیک کنید.',
    download_github: 'دانلود (GitHub)', download_fdroid: 'دانلود (F-Droid)'
  },
  zh: {
    settings: '设置', theme: '主题', language: '语言', light: '浅色', dark: '深色', auto: '自动',
    seconds: '秒', redirecting_to: '正在重定向到', you_will_be_redirected: '您将在以下时间后自动重定向',
    if_not: '如果没有任何反应，请单击下面的按钮。', proceed: '导入', error_redirect: '重定向错误',
    error_description: '重定向链接丢失或无效。',
    obtainium_info: '如果重定向没有发生，您可能没有安装 Obtainium 应用程序。请从 GitHub 或 F-Droid 下载它，然后点击下方的“导入”按钮。',
    download_github: '下载 (GitHub)', download_fdroid: '下载 (F-Droid)'
  }
}

function getBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language || (navigator as any).userLanguage || 'en'
  if (lang.startsWith('ru')) return 'ru'
  if (lang.startsWith('fa')) return 'fa'
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

export default function RedirectPage() {
  const params = useSearchParams()
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru')
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')
  const [timerValue, setTimerValue] = useState(10)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const timerRef = useRef<number | null>(null)
  const [systemDark, setSystemDark] = useState(false)

  const redirectTo = useMemo(() => {
    const value = params?.get('redirect_to') || ''
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }, [params])

  const appInfo = useMemo(() => {
    return appSchemes.find((a) => redirectTo.startsWith(a.scheme)) || null
  }, [redirectTo])

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key
  }

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'auto') || 'auto'
    const savedLang = (localStorage.getItem('lang') as Language) || getBrowserLanguage()
    setTheme(savedTheme)
    setCurrentLanguage(savedLang)
  }, [])

  useEffect(() => {
    localStorage.setItem('lang', currentLanguage)
  }, [currentLanguage])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage
    }
  }, [currentLanguage])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!redirectTo || timerRef.current) return
    timerRef.current = window.setInterval(() => {
      setTimerValue((v) => {
        if (v <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          timerRef.current = null
          window.location.href = redirectTo
          return 0
        }
        return v - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [redirectTo])

  const isDark = useMemo(() => {
    return theme === 'auto' ? systemDark : theme === 'dark'
  }, [theme, systemDark])

  const appId = appInfo ? appInfo.id : 'default'
  const appName = appInfo ? (appInfo.name[currentLanguage] || appInfo.name.en) : 'App'

  const handleTheme = (mode: 'light' | 'dark' | 'auto') => setTheme(mode)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className={`${styles.root} ${isDark ? styles.darkTheme : ''}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>Orion</div>
          <div className={styles.controls}>
            <button className={`${styles.btn} ${styles.btnIcon}`} onClick={openModal}>
              <svg className={`${styles.w6} ${styles.h6}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className={styles.btnText}>{t('settings')}</span>
            </button>
          </div>
        </header>

        <main>
          <div className={styles.card}>
            <div className={styles.appHeader}>
              <div className={styles.appIcon} dangerouslySetInnerHTML={{ __html: appIcons[appId] || appIcons['default'] }} />
              <h2 className={styles.appName}>{redirectTo ? appName : t('error_redirect')}</h2>
            </div>

            {!redirectTo ? (
              <p className={styles.redirectInfo}>{t('error_description')}</p>
            ) : (
              <>
                <p className={styles.redirectInfo}>{`${t('redirecting_to')} ${appName}...`}</p>
                <div>
                  <p className={styles.redirectInfo}>{t('you_will_be_redirected')}</p>
                  <div className={styles.timerContainer}>
                    <span className={styles.timer}>{timerValue}</span>
                    <span>{t('seconds')}</span>
                  </div>
                </div>
                {appInfo && appInfo.id === 'obtainium' ? (
                  <div className={styles.obtainiumInfo}>
                    <p>{t('obtainium_info')}</p>
                    <div className={styles.downloadButtons}>
                      <a href="https://github.com/ImranR98/Obtainium/releases/latest/download/app-release.apk" className={`${styles.btn} ${styles.btnPrimary}`} target="_blank" rel="noreferrer">{t('download_github')}</a>
                      <a href="https://f-droid.org/packages/dev.imranr.obtainium.fdroid/" className={`${styles.btn} ${styles.btnPrimary}`} target="_blank" rel="noreferrer">{t('download_fdroid')}</a>
                    </div>
                  </div>
                ) : (
                  <p className={styles.redirectInfo}>{t('if_not')}</p>
                )}
                <a href={redirectTo || '#'} className={`${styles.btn} ${styles.btnPrimary}`} style={{ display: redirectTo ? 'inline-flex' : 'none' }} target="_blank" rel="noreferrer">
                  <span>{t('proceed')}</span>
                </a>
              </>
            )}
          </div>
        </main>
      </div>

      <footer className={styles.footer}>created ❤️ by legiz</footer>

      <div className={`${styles.modal} ${isModalOpen ? styles.modalActive : ''}`} onClick={(e) => { if (e.currentTarget === e.target) closeModal() }}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{t('settings')}</h3>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.step}>
              <div className={styles.stepTitle}>{t('theme')}</div>
              <div className={styles.stepButtons}>
                <button className={styles.btn} onClick={() => handleTheme('light')}>{t('light')}</button>
                <button className={styles.btn} onClick={() => handleTheme('dark')}>{t('dark')}</button>
                <button className={styles.btn} onClick={() => handleTheme('auto')}>{t('auto')}</button>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepTitle}>{t('language')}</div>
              <div className={styles.stepButtons}>
                <button className={styles.btn} onClick={() => setCurrentLanguage('en')}>English</button>
                <button className={styles.btn} onClick={() => setCurrentLanguage('ru')}>Русский</button>
                <button className={styles.btn} onClick={() => setCurrentLanguage('fa')}>فارسی</button>
                <button className={styles.btn} onClick={() => setCurrentLanguage('zh')}>中文</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}