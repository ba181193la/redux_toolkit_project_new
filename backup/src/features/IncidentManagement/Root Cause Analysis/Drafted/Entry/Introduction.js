const Introduction = ({ data }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  );
};

export default Introduction;
