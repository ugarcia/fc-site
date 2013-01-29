<?php
    
    $IMG_DIR = "/Site/resources/images/";
    $IMG_REL_DIR = "../resources/images/";
    $images = "";

    if (isSet($_FILES['fsImageInput'])) {

        foreach ($_FILES['fsImageInput']['name'] as $key=>$fileName) {
            $fileTemp=$_FILES['fsImageInput']['tmp_name'][$key];
            $fileDir = $IMG_REL_DIR.$fileName;
            if (move_uploaded_file($fileTemp, $fileDir))
                $images .=  $IMG_DIR.$fileName.";";
        }   
        unset($_FILES['fsImageInput']);   
        echo trim($images,';');

    } else {

        $BLOGS_FILE_PATH = '../json/blogs.json';

        if (!file_exists($BLOGS_FILE_PATH)) {
            $fh = fopen($BLOGS_FILE_PATH, 'w') or die("can't create blogs file");
            fwrite($fh, '[]') or die("can't write new blogs file");
        }
        $file_content = file_get_contents($BLOGS_FILE_PATH);

        switch($_SERVER['REQUEST_METHOD']) 
        {
            case "PUT":          parse_str(file_get_contents("php://input"),$_PUT);
                                        $json_st = str_replace("\?", '?', $_PUT['json']);
                                        $entry = json_decode($json_st);
                                        $list = json_decode($file_content);
                                        $blog = getBlog($list, $_GET['blog']) or die;
                                        replaceBlog($blog, $entry);
                                        file_put_contents('../json/blogs.json', json_encode($list));
                                        echo  $json_st;
                                        break;
            case "DELETE":    echo $_GET['blog'];
                                        break;
            case "GET":          echo $file_content;
                                        break;
            case "POST":        $json_st = str_replace("\?", '?', $_POST['json']);
                                        $entry = json_decode($json_st);
                                        $list = json_decode($file_content);
                                        array_push($list, $entry);
                                        file_put_contents('../json/blogs.json', json_encode($list));
                                        echo $json_st;
                                        break;
        }

    }

    function getBlog($list, $id)
    {
        foreach ($list as $key => $value)
            if ($value->id == $id)
                return $value;
        return NULL;
    }

    function replaceBlog($src, $tgt)
    {
        $src->id = $tgt->id;
        $src->title = $tgt->title;
        $src->content = $tgt->content;
        $src->date = $tgt->date;
        $src->likes = $tgt->likes;
    }
    
?>