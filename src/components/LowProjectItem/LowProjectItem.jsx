import { useParams  } from 'react-router-dom';
import { useState, useEffect} from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import s from "./LowProjectItem.module.scss";
import {useGetProjectLowByIdQuery} from '../../redux/projectSlice/projectSlice';
import roundingNumberFn from "../../helpers/roundingNumberFn";

function LowProjectItem() {
    const {id} = useParams();
    const { data: project} = useGetProjectLowByIdQuery(id);
    const[data, setData] = useState(project);
   
    useEffect(() => {
      try{
      setData(project); 
     } catch (error) {
      console.error('Error adding material:', error);
    }  
        
        }, [project]);
        

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const generatePdf = () => {
      if (data) {
        const content = [
          { text: `Назва кошторису:          ${data?.title}`, fontSize: 25, bold: true },
          { text: `Адреса об'єкту:                                                 ${data?.description}`, fontSize: 14, margin: [0, 10, 0, 20] },
        ];
    
        if (data.lowEstimates && data.lowEstimates.length > 0) {
          data.lowEstimates.forEach((estimate) => {
            content.push(
              { text: estimate?.title, fontSize: 20, bold: true, margin: [0, 30, 0, 10] },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                  body: [
                    [
                      { text: '№ з/п.', style: 'tableHeader' },
                      { text: 'Назва', style: 'tableHeader' },
                      { text: 'Одиниця', style: 'tableHeader' },
                      { text: 'Кількість', style: 'tableHeader' },
                      { text: 'Ціна в грн.', style: 'tableHeader' },
                      { text: 'Сума в грн.', style: 'tableHeader' }
                    ],
                    ...(estimate?.positions?.map(
                      ({ title, unit, price, number, result }, index) => [
                        { text: index + 1, style: 'tableCell' },
                        { text: title || '', style: 'tableCell' },
                        { text: unit || '', style: 'tableCell' },
                        { text: number || '', style: 'tableCell' },
                        { text: price || '', style: 'tableCell' },
                        { text: result && roundingNumberFn(result), style: 'tableCell' }
                      ]
                    ) || []),
                    [{}, {}, {}, {}, { text: 'Всього:', style: 'tableTotal' }, { text: estimate?.total && roundingNumberFn(estimate?.total), style: 'tableTotal' }]
                  ],
                },
                layout: 'lightHorizontalLines',
                style: 'tableExample',
              }
            );
          });
        }
        
        content.push({ text: `Загальна сума:                            ${data?.lowTotal && roundingNumberFn(data?.lowTotal)}`, fontSize: 30, marginTop: 30});
        if (data?.materialsTotal) {
          content.push({ text: `Витрачено на матеріали:          ${data?.materialsTotal && roundingNumberFn(data?.materialsTotal)}`, fontSize: 30, marginTop: 30});
        }
        if (data?.advancesTotal) {
          content.push({ text: `Аванс:                                             ${data?.advancesTotal && roundingNumberFn(data?.advancesTotal)}`, fontSize: 30, marginTop: 30});
        }
        if (data?.general) {
          content.push({ text: `До оплати:                                    ${data?.lowGeneral && roundingNumberFn(data?.lowGeneral)}`, fontSize: 30, marginTop: 30});
        }
        const styles = {
          tableExample: {
            margin: [0, 5, 0, 15],
            fontSize: 12,
            color: '#333',
          },
          tableHeader: {
            bold: true,
            fontSize: 14,
            color: 'white',
            fillColor: '#4CAF50', // Header background color
            alignment: 'center'
          },
          tableCell: {
            fontSize: 12,
            margin: [0, 5, 0, 5]
          },
          tableTotal: {
            bold: true,
            fontSize: 12,
            alignment: 'right'
          }
        };
    
        const pdfDoc = {
          content,
          styles
        };
    
        pdfMake.createPdf(pdfDoc).download(`${data?.title}.pdf`);
      }
    };
    


    return (
        <>
        {/* {error ? (<ForbiddenPage/>) :  */}
      {/* (  */}
        <div>

        <div className={s.buttonAddContainer}>
        <button className={s.createPdfFileButton} 
        onClick={generatePdf}
        >Створити PDF файл</button>
            
       </div>

       
        {data && (
          <>
        
            {data?.lowEstimates && data?.lowEstimates?.map(item => (
              <div key={item._id}>
                <div className={s.buttonAddContainer}>
                <p className={s.titleTable}>{item.title}</p>
                
                </div>     
                
                <table className={s.iksweb}>
                  <tbody>
                  <tr className={s.titleRow}>
             <td className={s.oneRow}>№ з/п.</td>
                   <td className={s.twoRow}>Назва </td>
                   <td className={s.threeRow}><p className={s.threeRowTitleText}>Одиниця</p></td>
                   <td className={s.threeRow}><p className={s.threeRowTitleText}>Кількість</p></td>
                   <td className={s.threeRow}><p className={s.threeRowTitleText}>Ціна в грн.</p></td>
                   <td className={s.threeSix}>Сума в грн.</td>
               </tr>
    
                    {item.positions &&
                      item.positions.map(({ _id, title, unit, price, number, result}, index) => (
                  <tr key={_id} className={s.dataRow}>
                  <td className={s.oneRow}>
                    {index + 1}
                                     
                    </td>
                  <td><p>{title}</p></td>                 
                  <td className={s.threeRow}><p>{unit}</p> </td>
                  <td className={s.threeRow}><p>{number}</p></td>
                 
                  <td className={s.fiveRow}><p>{price}</p></td>
                  <td className={s.threeSix}>{roundingNumberFn(result)}</td>
                        </tr>
                      ))}
    
                    <tr className={s.titleRow}>
                      <td colSpan='5'>Всього:</td>
                      <td className={s.threeSix}>{roundingNumberFn(item.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
    
        <div className={s.total}>
          <p>Загальна сума: </p>
          {data && <p>{roundingNumberFn(data.lowTotal)}</p>}
        </div>    
           {data?.materialsTotal && ( 
          <div className={s.total}>
            <p>Витрачено на матеріали:</p>
            
          <p>{roundingNumberFn(data?.materialsTotal)}</p> 
        </div> )}
        {data?.advancesTotal && (
        <div className={s.total}>    
            <p>Аванс:            </p>
            
          <p>{roundingNumberFn(data?.advancesTotal)}</p>
        </div>
        )}
        {data?.lowGeneral && (
         <div div className={s.totalGeneral}>
          <p>До оплати:</p>
          
          <p>{roundingNumberFn(data?.lowGeneral)}</p>
        </div>  )}
      </div>

    </>
        
      );
    
}
export default LowProjectItem;