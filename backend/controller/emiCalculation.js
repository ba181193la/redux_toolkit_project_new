
function calculateFlatEMI(principal, annualRate, tenureMonths) {
    const tenureYears = tenureMonths / 12;
    console.log(tenureYears);
    
    const interest = principal * (annualRate / 100) * tenureYears;
    const totalPayable = principal + interest;
    const emi = totalPayable / tenureMonths;
  
    return {
      principal: principal.toFixed(2),
      interest: interest.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
      monthlyEMI: emi.toFixed(2)
    };
  }
  
  // Example usage:
  const result = calculateFlatEMI(10000, 5, 6);
  console.log(result);
  
  
  function generateFlatEMITable(principal, annualRate, tenureMonths) {
    const tenureYears = tenureMonths / 12;
    const totalInterest = (principal * annualRate * tenureYears) / 100;
    const totalAmount = principal + totalInterest;
    const emi = totalAmount / tenureMonths;
    const monthlyInterest = totalInterest / tenureMonths;
    const monthlyPrincipal = principal / tenureMonths;
  
    const table = [];
    for (let month = 1; month <= tenureMonths; month++) {
      table.push({
        Month: month,
        EMI: emi.toFixed(2),
        Principal: monthlyPrincipal.toFixed(2),
        Interest: monthlyInterest.toFixed(2),
        Balance: (totalAmount - emi * month).toFixed(2)
      });
    }
  
    return {
      summary: {
        principal,
        totalInterest,
        totalAmount,
        emi: emi.toFixed(2)
      },
      table
    };
  }
  
  // Example usage
  const result1 = generateFlatEMITable(10000, 5, 12);
  console.log("Loan Summary:", result1.summary);
  console.table(result1.table);

//   EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
    // function calculateReducingEMI(principal, annualRate, tenureMonths) {
    //     const monthlyRate = annualRate / (12 * 100);
    //     const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    //     return emi.toFixed(2);
    // }

    function generateReducingEMITable(principal, annualRate, tenureMonths) {
        const monthlyRate = annualRate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      
        const table = [];
        let balance = principal;
        let totalInterest = 0;
      
        for (let month = 1; month <= tenureMonths; month++) {
          const interest = balance * monthlyRate;
          const principalPaid = emi - interest;
          balance -= principalPaid;
          totalInterest += interest;
      
          table.push({
            Month: month,
            EMI: emi.toFixed(2),
            Principal: principalPaid.toFixed(2),
            Interest: interest.toFixed(2),
            Balance: balance > 0 ? balance.toFixed(2) : "0.00"
          });
        }
      
        const totalAmount = emi * tenureMonths;
      
        return {
          summary: {
            principal,
            totalInterest: totalInterest.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            emi: emi.toFixed(2)
          },
          table
        };
      }
      
      // Example usage
      const result2 = generateReducingEMITable(10000, 5, 12);
      console.log("Loan Summary:", result2.summary);
      console.table(result2.table);