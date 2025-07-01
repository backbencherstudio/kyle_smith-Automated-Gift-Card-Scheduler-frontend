function GiftStatuse({ value }) {
    const baseClass =
        "text-sm px-2 py-3 text-center rounded-sm capitalize w-[80%]";

    if (value === "AVAILABLE") {
        return (
            <p className={`${baseClass} bg-green-100 flex gap-2 items-center justify-center  text-green-600 w-1/2`}>
                {value}
            </p>
        );
    } else if (value == "RESERVED") {
        return (<p className={`${baseClass} bg-purple-600/10 flex gap-2 items-center justify-center  text-purple-600 w-1/2`}>
             {value}
        </p>)
    } else if (value == "USED") {
        return (<p className={`${baseClass} bg-[#1141CB]/10  flex gap-2 items-center justify-center text-[#1141CB] w-1/2`}>
             {value}
        </p>)
    } else {
        return (
            <p className={`${baseClass} bg-red-100 text-red-600 flex gap-2 items-center justify-center w-1/2`}>
                  {value}
            </p>
        );
    }

}

export default GiftStatuse