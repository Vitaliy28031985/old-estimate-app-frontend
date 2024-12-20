 const Pencil = ({ width, height }) => {

    return (
        <>
            <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M4 20H20M4 20V16L12 8L14.869 5.131L14.87 5.13C15.265 4.735 15.463 4.537 15.691 4.463C15.8918 4.39775 16.1082 4.39775 16.309 4.463C16.537 4.537 16.734 4.735 17.129 5.129L18.869 6.869C19.265 7.265 19.463 7.463 19.537 7.691C19.6023 7.89183 19.6023 8.10817 19.537 8.309C19.463 8.537 19.265 8.735 18.869 9.131L16 12.001L12 8.001M4 20H8L16 12"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </>   
    )
}

export default Pencil;