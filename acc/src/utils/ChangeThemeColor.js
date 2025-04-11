export const changeThemeColor=(themeColor,backgoundLightColor)=>{    
    const changeThemeColor = {
        backgroundColor:!themeColor?'#0083c0': themeColor, //default theme color(blue)
        arrowColor :themeColor=== "#ffffff"? '#0083c0': themeColor,
        backgroundLightColor:!themeColor?'rgba(222, 245, 255, 1)':  themeColor=== "#0083c0"?"rgba(222, 245, 255, 1)":backgoundLightColor,
        textColor:!themeColor?'#0083c0': themeColor=== "#ffffff"? '#0083c0':themeColor,
        dotTextWrapperColor:"#fff"
    }
    return changeThemeColor
}

export const headerThemeColorChange = (themeColor) => {    
    const changeThemeColor = {
        headerBackgroundColor:(themeColor==="#ffffff"||themeColor==="#fff")? '#fff':themeColor,
        headerUserNameColor: (themeColor==="#ffffff"||themeColor==="#fff")? '#0083C0':'#fff',//default theme color(blue)
        headerStaffCategoryNameColor: (themeColor==="#ffffff" ||themeColor==="#fff")? '#666666':'#fff',
        headerStyledTypographyColor: (themeColor==="#ffffff"||themeColor==="#fff")? '#0083C0':'#fff' //default theme color(blue)
    }
   
    return changeThemeColor;
}

